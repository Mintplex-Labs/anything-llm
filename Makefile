run_dev_build:
	docker compose up --build -d
run_dev:
	docker compose up -d

start_frontend:
	cd /app/frontend && yarn run dev

start_collector:
	cd /app/collector && yarn run dev

start_server:
	cd /app/server/ && npx prisma generate --schema=./prisma/schema.prisma && npx prisma migrate deploy --schema=./prisma/schema.prisma && yarn run dev

collector_logs:
	docker compose logs -f collector

frontend_logs:
	docker compose logs -f frontend

server_logs:
	docker compose logs -f server
