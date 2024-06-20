{
  "name": "anything-llm",
  "version": "0.2.0",
  "description": "The best solution for turning private documents into a chat bot using off-the-shelf tools and commercially viable AI technologies.",
  "main": "index.js",
  "type": "module",
  "author": "Timothy Carambat (Mintplex Labs)",
  "license": "MIT",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "lint": "cd server && yarn lint && cd ../frontend && yarn lint && cd ../embed && yarn lint && cd ../collector && yarn lint",
    "setup": "cd server && yarn && cd ../collector && yarn && cd ../frontend && yarn && cd .. && yarn setup:envs && yarn prisma:setup && echo \"Please run yarn dev:server, yarn dev:collector, and yarn dev:frontend in separate terminal tabs.\"",
    "setup:envs": "cp -n ./frontend/.env.example ./frontend/.env && cp -n ./server/.env.example ./server/.env.development && cp -n ./collector/.env.example ./collector/.env && cp -n ./docker/.env.example ./docker/.env && echo \"All ENV files copied!\n\"",
    "dev:server": "cd server && yarn dev",
    "dev:collector": "cd collector && yarn dev",
    "dev:frontend": "cd frontend && yarn dev",
    "prisma:generate": "cd server && npx prisma generate",
    "prisma:migrate": "cd server && npx prisma migrate dev --name init",
    "prisma:seed": "cd server && npx prisma db seed",
    "prisma:setup": "yarn prisma:generate && yarn prisma:migrate && yarn prisma:seed",
    "prisma:reset": "truncate -s 0 server/storage/anythingllm.db && yarn prisma:migrate",
    "prod:server": "cd server && yarn start",
    "prod:frontend": "cd frontend && yarn build",
    "generate:cloudformation": "node cloud-deployments/aws/cloudformation/generate.mjs",
    "generate::gcp_deployment": "node cloud-deployments/gcp/deployment/generate.mjs",
    "verify:translations": "cd frontend/src/locales && node verifyTranslations.mjs"
  },
  "private": false
}