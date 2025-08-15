# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AnythingLLM is a full-stack application that turns any document into context for LLM chatting. It's a monorepo with three main services:

- **server/**: Node.js Express API server handling LLM interactions, vector database management, and user authentication
- **frontend/**: React + Vite UI for document management and chat interface  
- **collector/**: Node.js service for processing and parsing documents from various sources

## Development Commands

### Initial Setup
```bash
yarn setup                    # Install dependencies and setup ENV files
yarn prisma:setup            # Generate Prisma client, run migrations, and seed
```

### Development (run in separate terminals)
```bash
yarn dev:server              # Start server in development mode
yarn dev:frontend            # Start frontend with hot reload
yarn dev:collector           # Start document collector service
yarn dev:all                 # Run all three services concurrently
```

### Testing and Quality
```bash
yarn test                    # Run Jest tests across all services
yarn lint                   # Run linting on all three services
```

### Production
```bash
yarn prod:frontend          # Build frontend for production
yarn prod:server            # Start server in production mode
```

### Database Management
```bash
yarn prisma:generate        # Generate Prisma client
yarn prisma:migrate         # Run database migrations
yarn prisma:seed            # Seed database with initial data
yarn prisma:reset           # Reset database and re-migrate
```

## Architecture

### Database Layer
- Uses Prisma ORM with SQLite by default (PostgreSQL configurable)
- Main models: `workspaces`, `workspace_documents`, `workspace_chats`, `users`, `invites`, `system_settings`
- Schema located at `server/prisma/schema.prisma`

### LLM Providers
- Modular provider system in `server/utils/AiProviders/`
- Supports OpenAI, Anthropic, Ollama, Azure, AWS Bedrock, Google Gemini, and many others
- Each provider implements standardized chat completion interface

### Vector Database Support
- Pluggable vector database system in `server/utils/vectorDbProviders/`
- Supports LanceDB (default), Pinecone, Chroma, Qdrant, Weaviate, Milvus, PGVector, AstraDB
- Document embeddings handled by `server/utils/EmbeddingEngines/`

### Document Processing
- Document collector processes PDFs, DOCX, TXT, and other formats
- OCR support via Tesseract for images
- Web scraping via Puppeteer
- YouTube transcript extraction
- Confluence, GitHub, GitLab, and Obsidian integrations

### Authentication & Authorization
- Multi-user support with role-based permissions
- JWT-based authentication
- Password recovery system
- API key management for programmatic access

### Multi-tenancy
- Workspace-based isolation
- Documents can be shared across workspaces
- User permissions per workspace
- Workspace-specific settings and configurations

## Key File Locations

### Server Core
- `server/index.js` - Main server entry point
- `server/endpoints/` - API route handlers
- `server/models/` - Prisma database models
- `server/utils/chats/` - Core chat functionality and streaming
- `server/utils/agents/` - AI agent implementations

### Frontend Core  
- `frontend/src/App.jsx` - Main React application
- `frontend/src/pages/` - Page components
- `frontend/src/components/` - Reusable UI components
- `frontend/src/models/` - API client functions

### Collector Core
- `collector/index.js` - Document collector entry point
- `collector/processSingleFile/` - File processing logic
- `collector/utils/extensions/` - Third-party integrations

## Development Guidelines

### Code Style
- Uses ESLint with Prettier formatting
- Hermes parser for Flow type annotations
- React 18 with JSX runtime
- No PropTypes validation (disabled in ESLint)

### Testing
- Jest for unit testing
- Tests required for bug fixes and new features
- Focus on error case testing with clear error messages

### Database Changes
- Always use Prisma migrations for schema changes
- Run `yarn prisma:migrate` after schema modifications
- Update seed data in `server/prisma/seed.js` if needed

### Adding New LLM Providers
- Create new provider in `server/utils/AiProviders/[provider]/`
- Implement required interface methods (chat completion, model fetching)
- Add provider option to frontend LLM selection components
- Update model mapping in `server/utils/AiProviders/modelMap/`

### Adding New Vector Databases
- Implement provider in `server/utils/vectorDbProviders/[provider]/`
- Add setup documentation in provider directory
- Create frontend configuration component
- Test with various document types and embedding models