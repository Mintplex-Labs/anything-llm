# PostgreSQL Migration Guide

## Why PostgreSQL?

SQLite is great for development, but PostgreSQL offers:
- Better concurrent write performance (multiple uploads simultaneously)
- Better support for large TEXT fields (RFQ descriptions, legal clauses)
- Native full-text search (can enhance hybrid search)
- Better JSON support (for metadata fields)
- Production-ready for Docker deployments

## Migration Steps

### Step 1: Update Prisma Schema

In `server/prisma/schema.prisma`, change:

```prisma
// FROM (SQLite):
datasource db {
  provider = "sqlite"
  url      = "file:../storage/anythingllm.db"
}

// TO (PostgreSQL):
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 2: Update Data Types (If Needed)

SQLite uses flexible types, but PostgreSQL is stricter. Review these changes:

**String length limits:**
```prisma
// Before (SQLite - no limit)
description String

// After (PostgreSQL - specify if > 1000 chars)
description String @db.Text
```

**Decimal precision:**
```prisma
// Before (SQLite - Float)
totalAmount Float

// After (PostgreSQL - Decimal for money)
totalAmount Decimal @db.Decimal(18, 2)
```

**UUIDs:**
```prisma
// Before (SQLite - String)
id String @id @default(uuid())

// After (PostgreSQL - native UUID)
id String @id @default(uuid()) @db.Uuid
```

### Step 3: Set Up PostgreSQL Database

#### Option A: Docker Compose (Recommended)

Add to your `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: anythingllm-postgres
    environment:
      POSTGRES_DB: anythingllm
      POSTGRES_USER: anythingllm
      POSTGRES_PASSWORD: your_secure_password_here
    ports:
      - "5432:5432"
    volumes:
      - ./docker/postgres:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - anythingllm-network

  # Your existing services...
  anything-llm:
    depends_on:
      - postgres
    environment:
      DATABASE_URL: "postgresql://anythingllm:your_secure_password_here@postgres:5432/anythingllm?schema=public"
```

Then run:
```bash
docker compose up -d postgres
```

#### Option B: Local PostgreSQL

Install PostgreSQL:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql@15
brew services start postgresql@15
```

Create database:
```bash
sudo -u postgres psql
CREATE DATABASE anythingllm;
CREATE USER anythingllm WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE anythingllm TO anythingllm;
\q
```

### Step 4: Set Environment Variable

Create/edit `.env` file in `server/` directory:

```bash
# PostgreSQL connection (Docker)
DATABASE_URL="postgresql://anythingllm:your_secure_password_here@localhost:5432/anythingllm?schema=public"

# OR for local PostgreSQL
DATABASE_URL="postgresql://anythingllm:your_password@localhost:5432/anythingllm?schema=public"
```

**Security Note**: Add `.env` to `.gitignore`!

### Step 5: Migrate Data (If You Have Existing Data)

If you already have data in SQLite and want to keep it:

#### Option 1: Use Prisma Migrate
```bash
cd server

# Create migration from SQLite
npx prisma migrate dev --name migrate_to_postgres --create-only

# Review the migration file in prisma/migrations/
# Make any necessary adjustments

# Apply migration
npx prisma migrate deploy
```

#### Option 2: Export/Import Data

**Export from SQLite:**
```bash
cd server
node -e "
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function exportData() {
  const rfqs = await prisma.rfq_metadata.findMany({ include: { quotations: { include: { items: true } } } });
  const pos = await prisma.purchase_orders.findMany({ include: { items: true } });
  const invoices = await prisma.invoices.findMany({ include: { items: true } });
  const certificates = await prisma.certificates.findMany({ include: { items: true } });
  
  fs.writeFileSync('backup.json', JSON.stringify({ rfqs, pos, invoices, certificates }, null, 2));
  console.log('✅ Data exported to backup.json');
}

exportData().then(() => prisma.\$disconnect());
"
```

**Import to PostgreSQL:**

1. Update `DATABASE_URL` to PostgreSQL
2. Run migrations: `npx prisma migrate deploy`
3. Import data:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function importData() {
  const backup = JSON.parse(fs.readFileSync('backup.json', 'utf-8'));
  
  for (const rfq of backup.rfqs) {
    const { quotations, ...rfqData } = rfq;
    await prisma.rfq_metadata.create({
      data: {
        ...rfqData,
        quotations: {
          create: quotations.map(q => ({
            ...q,
            items: { create: q.items },
          })),
        },
      },
    });
  }
  
  // Repeat for pos, invoices, certificates...
  console.log('✅ Data imported to PostgreSQL');
}

importData().then(() => prisma.\$disconnect());
"
```

### Step 6: Generate Prisma Client

```bash
cd server
npx prisma generate
```

### Step 7: Test Connection

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.\$connect();
    console.log('✅ PostgreSQL connection successful!');
    
    const count = await prisma.rfq_metadata.count();
    console.log(\`   Found \${count} RFQs in database\`);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await prisma.\$disconnect();
  }
}

test();
"
```

### Step 8: Update Docker Healthcheck (Optional)

If using Docker, update healthcheck to check PostgreSQL:

```bash
# In docker-compose.yml
postgres:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U anythingllm"]
    interval: 10s
    timeout: 5s
    retries: 5

anything-llm:
  depends_on:
    postgres:
      condition: service_healthy
```

---

## Performance Tuning (PostgreSQL)

### Enable Extensions

Connect to PostgreSQL and enable useful extensions:

```sql
-- Full-text search (for hybrid search enhancement)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- JSON operators
CREATE EXTENSION IF NOT EXISTS btree_gin;
```

### Add Indexes for Common Queries

In `schema.prisma`, add indexes:

```prisma
model quotations {
  // ... existing fields ...
  
  @@index([rfqId, vendorName])
  @@index([totalAmount])
  @@index([quotedDate])
}

model rfq_metadata {
  // ... existing fields ...
  
  @@index([rfqNumber])
  @@index([submissionDeadline])
  @@index([buyerName])
}

model purchase_orders {
  // ... existing fields ...
  
  @@index([poNumber])
  @@index([poDate])
  @@index([buyerName])
}
```

Then run:
```bash
npx prisma migrate deploy --name add_indexes
```

### Connection Pooling

In `server/utils/prisma.js`:

```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['warn', 'error'],
  // Connection pool settings
  pool: {
    timeout: 30, // seconds
    max: 10, // max connections
  },
});

module.exports = { prisma };
```

---

## Comparison: SQLite vs PostgreSQL

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| **Concurrent Writes** | ❌ Limited (locks entire DB) | ✅ Excellent (row-level locking) |
| **Text Size** | ✅ Up to 1GB | ✅ Up to 1GB (better performance) |
| **Setup** | ✅ Zero config | ⚠️ Requires server |
| **Backup** | ✅ Copy single file | ⚠️ Use pg_dump |
| **Full-text Search** | ⚠️ Basic FTS5 | ✅ Advanced (pg_trgm, GiST) |
| **JSON Support** | ⚠️ Limited | ✅ Native JSONB |
| **Transactions** | ✅ ACID | ✅ ACID + MVCC |
| **Production Ready** | ⚠️ For read-heavy | ✅ For all workloads |
| **Memory Usage** | ✅ Low | ⚠️ Higher |

---

## Rollback to SQLite

If you need to rollback:

1. Change `schema.prisma` back to SQLite datasource
2. Run `npx prisma migrate dev --name rollback_to_sqlite`
3. Restore data from `backup.json` (if you created one)

---

## Troubleshooting

### "relation does not exist"
```bash
# Run migrations
npx prisma migrate deploy

# Or reset and recreate
npx prisma migrate reset
```

### "too many clients"
```bash
# Increase PostgreSQL max_connections
# Edit postgresql.conf:
max_connections = 100

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Slow queries
```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM quotations WHERE rfqId = 'some-id';

-- Add missing indexes
CREATE INDEX idx_quotations_rfqid ON quotations(rfqId);
```

### Connection refused
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection settings
psql -U anythingllm -d anythingllm -h localhost -p 5432
```

---

## Recommendation

**For Development**: SQLite is fine (what you have now)

**For Production**: Switch to PostgreSQL if you have:
- Multiple users uploading documents simultaneously
- Large documents (> 100 pages with OCR text)
- Need for advanced search features
- Planning to scale beyond 10,000 documents

**When to migrate**: After you've tested the hybrid search system with SQLite and confirmed it works for your use case.

---

## Next Steps After Migration

1. **Enable PostgreSQL full-text search** to enhance hybrid search
2. **Set up automated backups** with pg_dump
3. **Monitor query performance** with pg_stat_statements
4. **Consider read replicas** if you have heavy read workload

---

Good luck with your migration! 🚀
