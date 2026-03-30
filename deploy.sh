#!/bin/bash

# JPG Style SmartWash - Deployment Script
# Автоматизированный деплой на VPS сервер

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции логирования
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Проверка зависимостей
check_dependencies() {
    log_info "Проверка зависимостей..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker не установлен"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        log_error "Git не установлен"
        exit 1
    fi
    
    log_success "Все зависимости установлены"
}

# Подключение к серверу и деплой
deploy() {
    local server_ip=$1
    local ssh_user=$2
    local project_path=$3
    
    log_info "Подключение к серверу $server_ip..."
    
    ssh -t "$ssh_user@$server_ip" << 'DEPLOY_SCRIPT'
        set -e
        
        PROJECT_PATH="/home/yoyo/jpg-style-smartwash"
        
        echo "📦 Обновление кода..."
        cd $PROJECT_PATH
        git pull origin main
        
        echo "🔨 Сборка и запуск контейнеров..."
        docker compose -f docker-compose.prod.yml down
        docker compose -f docker-compose.prod.yml up -d --build
        
        echo "⏳ Ожидание запуска сервисов..."
        sleep 10
        
        echo "✅ Проверка статуса..."
        docker compose -f docker-compose.prod.yml ps
        
        echo "🔍 Проверка здоровья сервисов..."
        curl -s http://localhost:3010 > /dev/null && echo "✓ Frontend работает"
        curl -s http://localhost:3011/api/health > /dev/null && echo "✓ API работает"
        
        echo "✅ Деплой завершён успешно!"
DEPLOY_SCRIPT
    
    log_success "Деплой завершён"
}

# Откат на предыдущую версию
rollback() {
    local server_ip=$1
    local ssh_user=$2
    
    log_warning "Откат на предыдущую версию..."
    
    ssh -t "$ssh_user@$server_ip" << 'ROLLBACK_SCRIPT'
        PROJECT_PATH="/home/yoyo/jpg-style-smartwash"
        
        cd $PROJECT_PATH
        
        echo "📋 Последние коммиты:"
        git log --oneline -5
        
        read -p "Введите хеш коммита для отката: " commit_hash
        
        echo "🔄 Откат на $commit_hash..."
        docker compose -f docker-compose.prod.yml down
        git reset --hard $commit_hash
        docker compose -f docker-compose.prod.yml up -d --build
        
        echo "✅ Откат завершён"
ROLLBACK_SCRIPT
}

# Просмотр логов
view_logs() {
    local server_ip=$1
    local ssh_user=$2
    local service=$3
    
    log_info "Логи сервиса: $service"
    
    ssh "$ssh_user@$server_ip" \
        "docker compose -f /home/yoyo/jpg-style-smartwash/docker-compose.prod.yml logs -f --tail=100 $service"
}

# Проверка статуса
check_status() {
    local server_ip=$1
    local ssh_user=$2
    
    log_info "Проверка статуса сервисов..."
    
    ssh "$ssh_user@$server_ip" << 'STATUS_SCRIPT'
        echo "🐳 Docker контейнеры:"
        docker compose -f /home/yoyo/jpg-style-smartwash/docker-compose.prod.yml ps
        
        echo ""
        echo "📊 Использование ресурсов:"
        docker stats --no-stream smartwash_web smartwash_api smartwash_postgres smartwash_redis
        
        echo ""
        echo "🔍 Проверка портов:"
        echo "Frontend (3010): $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3010)"
        echo "API (3011): $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3011/api/health)"
STATUS_SCRIPT
}

# Главное меню
main() {
    if [ $# -eq 0 ]; then
        echo "JPG Style SmartWash - Deployment Tool"
        echo ""
        echo "Использование:"
        echo "  $0 deploy <server_ip> <ssh_user>"
        echo "  $0 rollback <server_ip> <ssh_user>"
        echo "  $0 logs <server_ip> <ssh_user> <service>"
        echo "  $0 status <server_ip> <ssh_user>"
        echo ""
        echo "Примеры:"
        echo "  $0 deploy 172.16.252.32 yoyo"
        echo "  $0 logs 172.16.252.32 yoyo api"
        echo "  $0 status 172.16.252.32 yoyo"
        exit 0
    fi
    
    check_dependencies
    
    case "$1" in
        deploy)
            if [ $# -lt 3 ]; then
                log_error "Недостаточно аргументов"
                exit 1
            fi
            deploy "$2" "$3"
            ;;
        rollback)
            if [ $# -lt 3 ]; then
                log_error "Недостаточно аргументов"
                exit 1
            fi
            rollback "$2" "$3"
            ;;
        logs)
            if [ $# -lt 4 ]; then
                log_error "Недостаточно аргументов"
                exit 1
            fi
            view_logs "$2" "$3" "$4"
            ;;
        status)
            if [ $# -lt 3 ]; then
                log_error "Недостаточно аргументов"
                exit 1
            fi
            check_status "$2" "$3"
            ;;
        *)
            log_error "Неизвестная команда: $1"
            exit 1
            ;;
    esac
}

main "$@"
