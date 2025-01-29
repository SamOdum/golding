# Golding Project

A modern but tiny full-stack application built with Node.js, TypeScript, and modern web technologies.

## Project Structure

The project is organized as a monorepo with two main components:

- `backend/`: Node.js backend service with Prisma ORM
- `frontend/`: Modern web frontend built with Vue.js, TypeScript, and Tailwind CSS

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker and Docker Compose (for containerized development)

## Environment Setup

1. Copy the environment template file to create your local environment file:

```bash
cp .env.template .env
```

2. The following environment variables are used in the project:

### Database Configuration

- `POSTGRES_USER`: PostgreSQL database user (default: postgres)
- `POSTGRES_PASSWORD`: PostgreSQL database password (default: postgres)
- `POSTGRES_DB`: Database name (default: golding)
- `DATABASE_URL`: Full PostgreSQL connection string

### Backend Configuration

- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Backend server port (default: 8000)
- `JWT_SECRET`: Secret key for JWT token generation (change in production!)
- `CORS_ORIGIN`: Allowed CORS origin (default: http://localhost:5173)

### Frontend Configuration

- `VITE_API_URL`: Backend API URL (default: http://localhost:8000)
- `VITE_APP_TITLE`: Application title

Note: For security, make sure to change sensitive values like `JWT_SECRET` and database credentials in production environments.

## Getting Started

### Installation

1. Install dependencies for all packages:

```bash
pnpm install:all
```

Or install separately for each package:

```bash
pnpm install:backend
pnpm install:frontend
```

### Development

#### Option 1: Using Docker (Recommended)

Start the entire application stack with Docker Compose:
**Note**: The environment variables `.env` must be present in the root of the project.

```bash
pnpm docker:dev
```

Stop and remove containers:

```bash
pnpm docker:dev:down
```

#### Option 2: Running Services Individually

1. Start the backend development server:

```bash
pnpm dev:backend
```

2. In a separate terminal, start the frontend development server:

```bash
pnpm dev:frontend
```

### Database Management

- Generate Prisma client: `pnpm db:generate`
- Run migrations: `pnpm db:migrate`
- Seed the database: `pnpm db:seed`
- Reset the database: `pnpm db:reset`

### Production

Build and start the production environment:

```bash
pnpm docker:prod:build
pnpm docker:prod:up
```

Stop production services:

```bash
pnpm docker:prod:down
```

### Testing

Run tests for all packages:

```bash
pnpm test
```

Or test specific package:

```bash
pnpm test:backend
```

### Code Quality

- Lint code: `pnpm lint`
- Format code: `pnpm format`
- Type check: `pnpm type-check`

## Development Tools

- **TypeScript**: For type-safe code
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Jest**: Testing framework
- **Prisma**: Database ORM
- **Docker**: Containerization
- **Vite**: Frontend build tool
- **Tailwind CSS**: Utility-first CSS framework

## License

Private repository. All rights reserved.
