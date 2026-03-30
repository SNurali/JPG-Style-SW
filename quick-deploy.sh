#!/bin/bash

# JPG Style SmartWash - Quick Deploy Script for AI Agent
# Этот скрипт предназначен для быстрого деплоя через AI агента

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

# Конфигурация
VPS_IP="${1:-172.16.252.32}"
SSH_USER="${2:-yoyo}"
PROJECT_PATH="/home/yoyo/jpg-style-smartwash"

log_info "JPG Style SmartWash - AI Agent Deployment"
log_info "VPS IP: $VPS_IP"
log_info "SSH User: $SSH_USER"
log_info "Project Path: $PROJECT_PATH"

# Проверка SSH доступа
log_info "Проверка SSH доступа..."
if ! ssh -o ConnectTimeout=5 "$SSH_USER@$VPS_IP" "echo 'SSH OK'" > /dev/null 2>&1; then
    log_error "Не удалось подключиться к серверу"
    exit 1
fi
log_success "SSH доступ OK"

# Выбор режима деплоя
echo ""
echo "Выберите режим деплоя:"
echo "1) Первичная настройка (первый раз)"
echo "2) Обновление и деплой (уже установлено)"
echo "3) Только обновление кода"
echo "4) Проверка статуса"
echo "5) Просмотр логов"
read -p "Выбор (1-5): " choice

case $choice in
    1)
        log_info "Первичная настройка..."
        ssh -t "$SSH_USER@$VPS_IP" << 'SETUP_SCRIPT'
            set -e
            cd /home/yoyo
            
            if [ -d "jpg-style-smartwash" ]; then
                echo "Директория уже существует, пропускаю клонирование"
            else
                echo "Клонирование репозитория..."
                git clone https://github.com/SNurali/JPG-Style-SW.git jpg-style-smartwash
            fi
            
            cd jpg-style-smartwash
            
            echo "Запуск скрипта первичной настройки..."
            sudo bash setup-production.sh
SETUP_SCRIPT
        log_success "Первичная настройка завершена"
        ;;
    
    2)
        log_info "Обновление и деплой..."
        ssh -t "$SSH_USER@$VPS_IP" << 'UPDATE_SCRIPT'
            set -e
            cd /home/yoyo/jpg-style-smartwash
            
            echo "Обновление кода..."
            git pull origin main
            
            echo "Остановка контейнеров..."
            docker compose -f docker-compose.prod.yml down
            
            echo "Пересборка и запуск контейнеров..."
            docker compose -f docker-compose.prod.yml up -d --build
            
            echo "Ожидание запуска сервисов (30 сек)..."
            sleep 30
            
            echo "Проверка статуса..."
            docker compose -f docker-compose.prod.yml ps
            
            echo "✅ Деплой завершён успешно!"
UPDATE_SCRIPT
        log_success "Деплой завершён"
        ;;
    
    3)
        log_info "Обновление кода..."
        ssh "$SSH_USER@$VPS_IP" << 'CODE_UPDATE'
            cd /home/yoyo/jpg-style-smartwash
            git pull origin main
            echo "✅ Код обновлён"
CODE_UPDATE
        log_success "Код обновлён"
        ;;
    
    4)
        log_info "Проверка статуса..."
        ssh "$SSH_USER@$VPS_IP" << 'STATUS_CHECK'
            echo "🐳 Docker контейнеры:"
            docker compose -f /home/yoyo/jpg-style-smartwash/docker-compose.prod.yml ps
            
            echo ""
            echo "📊 Использование ресурсов:"
            docker stats --no-stream smartwash_web smartwash_api smartwash_postgres smartwash_redis 2>/dev/null || echo "Контейнеры не запущены"
            
            echo ""
            echo "🔍 Проверка портов:"
            echo -n "Frontend (3000): "
            curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000 || echo "Недоступен"
            
            echo -n "API (4000): "
            curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4000/health || echo "Недоступен"
STATUS_CHECK
        ;;
    
    5)
        log_info "Просмотр логов (последние 50 строк)..."
        read -p "Какой сервис? (web/api/postgres/redis/all): " service
        
        if [ "$service" = "all" ]; then
            ssh "$SSH_USER@$VPS_IP" \
                "docker compose -f /home/yoyo/jpg-style-smartwash/docker-compose.prod.yml logs --tail=50"
        else
            ssh "$SSH_USER@$VPS_IP" \
                "docker compose -f /home/yoyo/jpg-style-smartwash/docker-compose.prod.yml logs --tail=50 $service"
        fi
        ;;
    
    *)
        log_error "Неверный выбор"
        exit 1
        ;;
esac

echo ""
log_success "Операция завершена!"
