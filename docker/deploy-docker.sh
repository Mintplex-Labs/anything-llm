#!/bin/bash

# AnythingLLM with Hybrid Search - Docker Deployment Script
# Usage: ./deploy-docker.sh [start|stop|restart|logs|rebuild]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env exists
if [ ! -f .env ]; then
    log_error ".env file not found!"
    log_info "Copying .env.example to .env..."
    if [ -f .env.example ]; then
        cp .env.example .env
        log_warn "Please edit .env and update your configuration!"
        exit 1
    else
        log_error ".env.example not found either!"
        exit 1
    fi
fi

case "$1" in
    start)
        log_info "🚀 Starting AnythingLLM with Hybrid Search..."
        docker-compose up -d
        
        log_info "⏳ Waiting for services to be ready..."
        sleep 10
        
        log_info "🔧 Running database migrations..."
        docker-compose exec -T anything-llm sh -c "cd /app/server && npx prisma migrate deploy"
        
        log_info "✅ Services started successfully!"
        log_info ""
        log_info "📊 Service URLs:"
        log_info "  - AnythingLLM: http://localhost:3001"
        log_info "  - Qdrant: http://localhost:6333"
        log_info "  - PostgreSQL: localhost:5432"
        log_info ""
        log_info "📝 Check logs: ./deploy-docker.sh logs"
        ;;
        
    stop)
        log_info "🛑 Stopping services..."
        docker-compose down
        log_info "✅ Services stopped!"
        ;;
        
    restart)
        log_info "🔄 Restarting services..."
        $0 stop
        sleep 2
        $0 start
        ;;
        
    logs)
        log_info "📝 Showing logs (Ctrl+C to exit)..."
        docker-compose logs -f
        ;;
        
    rebuild)
        log_info "🔨 Rebuilding containers..."
        docker-compose down
        docker-compose build --no-cache
        log_info "✅ Rebuild complete!"
        log_info "Start services with: ./deploy-docker.sh start"
        ;;
        
    status)
        log_info "📊 Service Status:"
        docker-compose ps
        ;;
        
    shell)
        log_info "🐚 Opening shell in anythingllm container..."
        docker-compose exec anything-llm sh
        ;;
        
    db-shell)
        log_info "🐘 Opening PostgreSQL shell..."
        docker-compose exec postgres psql -U anythingllm -d anythingllm
        ;;
        
    test-api)
        log_info "🧪 Testing Hybrid Search API endpoints..."
        docker-compose exec anything-llm sh -c "cd /app/server && node test-api-endpoints.js"
        ;;
        
    migrate)
        log_info "🔧 Running database migrations..."
        docker-compose exec anything-llm sh -c "cd /app/server && npx prisma migrate dev"
        ;;
        
    backup)
        BACKUP_DIR="./backups"
        mkdir -p "$BACKUP_DIR"
        TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
        
        log_info "💾 Creating backup..."
        docker-compose exec -T postgres pg_dump -U anythingllm anythingllm > "$BACKUP_DIR/backup_$TIMESTAMP.sql"
        log_info "✅ Backup saved: $BACKUP_DIR/backup_$TIMESTAMP.sql"
        ;;
        
    restore)
        if [ -z "$2" ]; then
            log_error "Usage: ./deploy-docker.sh restore <backup_file.sql>"
            exit 1
        fi
        
        log_warn "⚠️  This will REPLACE all data in the database!"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            log_info "📥 Restoring from backup..."
            docker-compose exec -T postgres psql -U anythingllm anythingllm < "$2"
            log_info "✅ Restore complete!"
        else
            log_info "Restore cancelled."
        fi
        ;;
        
    *)
        echo "Usage: $0 {start|stop|restart|logs|rebuild|status|shell|db-shell|test-api|migrate|backup|restore}"
        echo ""
        echo "Commands:"
        echo "  start      - Start all services"
        echo "  stop       - Stop all services"
        echo "  restart    - Restart all services"
        echo "  logs       - Show container logs"
        echo "  rebuild    - Rebuild containers from scratch"
        echo "  status     - Show service status"
        echo "  shell      - Open shell in AnythingLLM container"
        echo "  db-shell   - Open PostgreSQL shell"
        echo "  test-api   - Test Hybrid Search API endpoints"
        echo "  migrate    - Run database migrations"
        echo "  backup     - Backup PostgreSQL database"
        echo "  restore    - Restore from backup file"
        exit 1
        ;;
esac
