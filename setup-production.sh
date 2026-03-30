#!/bin/bash

# JPG Style SmartWash - Production Setup Script
# Автоматическая настройка production окружения

set -e

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }

# Проверка прав
if [ "$EUID" -ne 0 ]; then 
    log_error "Скрипт должен запускаться с правами root"
    exit 1
fi

log_info "Начало настройки production окружения..."

# Проверка Docker
if ! command -v docker &> /dev/null; then
    log_warning "Docker не установлен, устанавливаю..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    log_success "Docker установлен"
fi

# Проверка Docker Compose
if ! command -v docker-compose &> /dev/null; then
    log_warning "Docker Compose не установлен, устанавливаю..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log_success "Docker Compose установлен"
fi

# Проверка Git
if ! command -v git &> /dev/null; then
    log_warning "Git не установлен, устанавливаю..."
    apt-get update && apt-get install -y git
    log_success "Git установлен"
fi

# Создание директории проекта
PROJECT_DIR="/home/yoyo/jpg-style-smartwash"
if [ ! -d "$PROJECT_DIR" ]; then
    log_info "Создание директории проекта..."
    mkdir -p "$PROJECT_DIR"
    chown -R yoyo:yoyo "$PROJECT_DIR"
fi

# Клонирование репозитория
if [ ! -d "$PROJECT_DIR/.git" ]; then
    log_info "Клонирование репозитория..."
    cd "$PROJECT_DIR"
    sudo -u yoyo git clone https://github.com/SNurali/JPG-Style-SW.git .
    log_success "Репозиторий клонирован"
fi

# Создание .env.prod
if [ ! -f "$PROJECT_DIR/.env.prod" ]; then
    log_info "Создание .env.prod..."
    
    DB_PASSWORD=$(openssl rand -base64 24)
    JWT_SECRET=$(openssl rand -base64 32)
    JWT_REFRESH_SECRET=$(openssl rand -base64 32)
    
    cat > "$PROJECT_DIR/.env.prod" << EOF
# ─── Database ───
DB_HOST=smartwash_postgres
DB_PORT=5432
DB_USERNAME=smartwash
DB_PASSWORD=$DB_PASSWORD
DB_DATABASE=smartwash_db

# ─── Redis ───
REDIS_HOST=smartwash_redis
REDIS_PORT=6379

# ─── JWT ───
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET

# ─── API ───
APP_PORT=4000
CORS_ORIGINS=http://localhost:3000,http://195.158.24.137:3000

# ─── Web ───
WEB_PORT=3000
NEXT_PUBLIC_API_URL=http://195.158.24.137:4000

# ─── Telegram Bot ───
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
TELEGRAM_CHAT_ID=YOUR_CHAT_ID_HERE

# ─── Environment ───
NODE_ENV=production
LOG_LEVEL=info
EOF
    
    chown yoyo:yoyo "$PROJECT_DIR/.env.prod"
    chmod 600 "$PROJECT_DIR/.env.prod"
    log_success ".env.prod создан"
    log_warning "Обновите TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в $PROJECT_DIR/.env.prod"
fi

# Создание docker-compose.prod.yml
if [ ! -f "$PROJECT_DIR/docker-compose.prod.yml" ]; then
    log_info "Создание docker-compose.prod.yml..."
    cp "$PROJECT_DIR/docker-compose.prod.yml" "$PROJECT_DIR/docker-compose.prod.yml.bak" 2>/dev/null || true
    log_success "docker-compose.prod.yml готов"
fi

# Запуск контейнеров
log_info "Запуск контейнеров..."
cd "$PROJECT_DIR"
docker compose -f docker-compose.prod.yml up -d --build

# Ожидание запуска
log_info "Ожидание запуска сервисов (30 сек)..."
sleep 30

# Проверка здоровья
log_info "Проверка здоровья сервисов..."

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    log_success "Frontend работает (http://localhost:3000)"
else
    log_error "Frontend не отвечает"
fi

if curl -s http://localhost:4000/health > /dev/null 2>&1; then
    log_success "API работает (http://localhost:4000)"
else
    log_error "API не отвечает"
fi

# Статус контейнеров
log_info "Статус контейнеров:"
docker compose -f docker-compose.prod.yml ps

# Настройка Nginx (опционально)
read -p "Настроить Nginx? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Настройка Nginx..."
    
    cat > /etc/nginx/sites-available/smartwash << 'NGINX_CONFIG'
server {
    listen 80;
    server_name smartwash.uz www.smartwash.uz 195.158.24.137;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10M;
    }
}
NGINX_CONFIG
    
    ln -sf /etc/nginx/sites-available/smartwash /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
    log_success "Nginx настроен"
fi

# Создание cron для автоматического обновления
log_info "Создание cron для автоматического обновления..."
cat > /etc/cron.d/smartwash-deploy << 'CRON_CONFIG'
# JPG Style SmartWash - Auto Deploy
# Проверяет обновления каждый час
0 * * * * yoyo cd /home/yoyo/jpg-style-smartwash && git pull origin main && docker compose -f docker-compose.prod.yml up -d --build >> /var/log/smartwash-deploy.log 2>&1
CRON_CONFIG

log_success "Cron задача создана"

# Итоговая информация
log_success "✅ Production окружение настроено!"
echo ""
echo "📋 Информация о сервисах:"
echo "  Frontend: http://195.158.24.137:3000"
echo "  API: http://195.158.24.137:4000"
echo "  PostgreSQL: localhost:5432"
echo "  Redis: localhost:6379"
echo ""
echo "📁 Директория проекта: $PROJECT_DIR"
echo "📝 Конфиг окружения: $PROJECT_DIR/.env.prod"
echo ""
echo "🔧 Полезные команды:"
echo "  docker compose -f docker-compose.prod.yml ps"
echo "  docker compose -f docker-compose.prod.yml logs -f"
echo "  docker compose -f docker-compose.prod.yml restart"
echo ""
echo "📚 Документация: $PROJECT_DIR/DEPLOYMENT_GUIDE_FULL.md"
