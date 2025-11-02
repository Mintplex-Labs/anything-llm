# 🐳 AnythingLLM with Hybrid Search - Docker Deployment

Hướng dẫn deploy **AnythingLLM + Hybrid Search + PostgreSQL + Qdrant** bằng Docker Compose.

---

## 📦 Services

Docker Compose sẽ chạy **4 services**:

1. **anything-llm** - Main application
2. **postgres** - PostgreSQL database (hybrid search data)
3. **qdrant** - Vector database (embeddings)
4. **cloudflared** - Cloudflare tunnel (optional)

---

## 🚀 Quick Start

### 1. Cấu hình Environment

```bash
cd /home/akbazan/Downloads/anything-llm/docker

# Edit .env file
nano .env
```

**Quan trọng**: Thay đổi những giá trị sau:
- `POSTGRES_PASSWORD` - Mật khẩu PostgreSQL
- `JWT_SECRET` - JWT secret key
- `OPEN_AI_KEY` - OpenAI API key (nếu dùng)
- `LLM_PROVIDER` - Chọn LLM provider

### 2. Build và Start

```bash
# Build containers
./deploy-docker.sh rebuild

# Start services
./deploy-docker.sh start
```

### 3. Verify Services

```bash
# Check status
./deploy-docker.sh status

# View logs
./deploy-docker.sh logs
```

---

## 🛠️ Available Commands

```bash
# Start services
./deploy-docker.sh start

# Stop services
./deploy-docker.sh stop

# Restart services
./deploy-docker.sh restart

# View logs
./deploy-docker.sh logs

# Rebuild containers
./deploy-docker.sh rebuild

# Check status
./deploy-docker.sh status

# Open shell in container
./deploy-docker.sh shell

# Open PostgreSQL shell
./deploy-docker.sh db-shell

# Test Hybrid Search API
./deploy-docker.sh test-api

# Run database migrations
./deploy-docker.sh migrate

# Backup database
./deploy-docker.sh backup

# Restore from backup
./deploy-docker.sh restore backups/backup_20251025_120000.sql
```

---

## 📊 Service URLs

After deployment:

- **AnythingLLM UI**: http://localhost:3001
- **Qdrant API**: http://localhost:6333
- **Qdrant Dashboard**: http://localhost:6333/dashboard
- **PostgreSQL**: localhost:5432

---

## 🔧 Configuration Details

### PostgreSQL

```yaml
Database: anythingllm
User: anythingllm
Password: (set in .env)
Port: 5432
```

**Connection String**:
```
postgresql://anythingllm:YOUR_PASSWORD@postgres:5432/anythingllm
```

### Qdrant

```yaml
HTTP Port: 6333
gRPC Port: 6334
Storage: ./qdrant_storage
```

### Storage Volumes

```
./postgres_data       → PostgreSQL data
./qdrant_storage      → Qdrant vectors
../server/storage     → Documents & files
```

---

## 🗄️ Database Migrations

### Auto-migration on Start

Migrations run automatically when you start services:

```bash
./deploy-docker.sh start
# Auto runs: npx prisma migrate deploy
```

### Manual Migration

```bash
# Run migrations
./deploy-docker.sh migrate

# Or inside container
./deploy-docker.sh shell
cd /app/server
npx prisma migrate dev
```

### Check Migration Status

```bash
./deploy-docker.sh shell
cd /app/server
npx prisma migrate status
```

---

## 📤 Data Import/Export

### Backup Database

```bash
# Auto backup with timestamp
./deploy-docker.sh backup

# Output: ./backups/backup_YYYYMMDD_HHMMSS.sql
```

### Restore Database

```bash
./deploy-docker.sh restore backups/backup_20251025_120000.sql
```

### Export to SQLite (for development)

```bash
# Inside container
./deploy-docker.sh shell

cd /app/server
npx prisma db pull
# Converts PostgreSQL schema to Prisma
```

---

## 🧪 Testing

### Test API Endpoints

```bash
# Automated test
./deploy-docker.sh test-api

# Manual test
curl http://localhost:3001/api/hybrid-search/active-rfqs
```

### Test Hybrid Search

```bash
curl -X POST http://localhost:3001/api/hybrid-search/search \
  -H "Content-Type: application/json" \
  -d '{"query": "RFQ deadline", "topK": 5}'
```

### Test PostgreSQL Connection

```bash
./deploy-docker.sh db-shell

# Inside psql:
\dt                    # List tables
SELECT * FROM rfq_metadata LIMIT 5;
\q                     # Quit
```

---

## 🔐 Security Checklist

Before production deployment:

- [ ] Change `POSTGRES_PASSWORD` in `.env`
- [ ] Generate new `JWT_SECRET`
- [ ] Set strong `SIG_KEY` and `SIG_SALT`
- [ ] Configure firewall (only ports 3001, 6333 exposed)
- [ ] Enable SSL/TLS (use Cloudflare or nginx-proxy)
- [ ] Set up automated backups
- [ ] Review `.env` file permissions (chmod 600)

---

## 📁 Directory Structure

```
docker/
├── docker-compose.yml          # Main compose file
├── deploy-docker.sh            # Deployment script
├── .env                        # Environment variables
├── Dockerfile                  # AnythingLLM container
├── postgres_data/              # PostgreSQL data (auto-created)
├── qdrant_storage/             # Qdrant vectors (auto-created)
├── backups/                    # Database backups (auto-created)
└── README_DOCKER.md            # This file
```

---

## 🐛 Troubleshooting

### Service won't start

```bash
# Check logs
./deploy-docker.sh logs

# Check specific service
docker-compose logs postgres
docker-compose logs qdrant
docker-compose logs anything-llm
```

### PostgreSQL connection error

```bash
# Check if PostgreSQL is ready
docker-compose exec postgres pg_isready -U anythingllm

# Check DATABASE_URL
./deploy-docker.sh shell
echo $DATABASE_URL
```

### Prisma migration failed

```bash
# Reset database (WARNING: deletes all data)
./deploy-docker.sh shell
cd /app/server
npx prisma migrate reset

# Or recreate from scratch
./deploy-docker.sh stop
docker volume rm docker_postgres_data
./deploy-docker.sh start
```

### Qdrant not accessible

```bash
# Test Qdrant API
curl http://localhost:6333/health

# Check from inside container
./deploy-docker.sh shell
curl http://qdrant:6333/health
```

### Out of disk space

```bash
# Check Docker disk usage
docker system df

# Clean up
docker system prune -a
docker volume prune
```

---

## 📈 Performance Tuning

### PostgreSQL

Edit `docker-compose.yml`:

```yaml
postgres:
  environment:
    # Increase memory
    POSTGRES_SHARED_BUFFERS: 256MB
    POSTGRES_EFFECTIVE_CACHE_SIZE: 1GB
    POSTGRES_MAX_CONNECTIONS: 100
```

### Qdrant

```yaml
qdrant:
  environment:
    # Tune performance
    QDRANT__SERVICE__MAX_REQUEST_SIZE_MB: 100
    QDRANT__STORAGE__OPTIMIZERS_CONFIG__INDEXING_THRESHOLD: 20000
```

---

## 🔄 Updates & Maintenance

### Update AnythingLLM

```bash
# Pull latest code
cd /home/akbazan/Downloads/anything-llm
git pull

# Rebuild
cd docker
./deploy-docker.sh rebuild
./deploy-docker.sh start
```

### Update Docker Images

```bash
# Pull latest Postgres & Qdrant
docker-compose pull

# Restart
./deploy-docker.sh restart
```

### Database Maintenance

```bash
# Vacuum database
./deploy-docker.sh db-shell
VACUUM ANALYZE;

# Check database size
SELECT pg_size_pretty(pg_database_size('anythingllm'));
```

---

## 🌐 Production Deployment

### With Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### With Cloudflare Tunnel

Already configured in `docker-compose.yml`. Just update:

```yaml
cloudflared:
  volumes:
    - ./cloudflared/credentials/YOUR_TUNNEL_ID.json:/etc/cloudflared/YOUR_TUNNEL_ID.json:ro
```

---

## 📞 Support

- **Documentation**: See `../server/README_HYBRID_SEARCH.md`
- **API Reference**: See `../server/HYBRID_SEARCH_API.md`
- **Issues**: Check container logs with `./deploy-docker.sh logs`

---

## ✅ Production Checklist

Before going live:

- [ ] All services start successfully
- [ ] Database migrations applied
- [ ] API endpoints responding
- [ ] Qdrant connected
- [ ] Hybrid search working
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] SSL/TLS enabled
- [ ] Firewall configured
- [ ] Logs rotation enabled
- [ ] `.env` secured (chmod 600)
- [ ] Default passwords changed

---

**Created**: October 25, 2025  
**Version**: 1.0.0  
**Status**: Production Ready 🚀
