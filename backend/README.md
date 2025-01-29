# Express.js Authentication API

A secure authentication API built with Express.js, TypeScript, and PostgreSQL.

## Features

- User authentication with JWT
- Protected routes with middleware
- Secure password hashing with bcrypt
- HTTP-only cookies for token storage
- PostgreSQL database with Prisma ORM
- TypeScript support
- Input validation with Zod
- CORS protection
- Automated tests

## Prerequisites

- Node.js and pnpm
- PostgreSQL database

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env` file:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/golding"
   PORT=8000
   JWT_SECRET=your-secret-key
   CORS_ORIGIN=http://localhost:5173
   ```

3. Set up the database:
   ```bash
   pnpm prisma migrate dev
   pnpm prisma generate
   ```

4. (Optional) Seed the database:
   ```bash
   pnpm prisma db seed
   ```

5. Start the development server:
   ```bash
   pnpm run dev
   ```

## API Endpoints

### POST /api/register
Register a new user

Request body:
```json
{
  "firstName": "firstName123",
  "lastName": "lastName123",
  "email": "user123@example.com",
  "password": "password123"
}
```

### POST /api/login
Login with credentials

Request body:
```json
{
  "email": "user123@example.com",
  "password": "password123"
}
```

### POST /api/logout
Logout current user (clears authentication cookie)

### GET /api/protected
Protected route requiring authentication. Returns current user information.

## Security Features

- Password hashing with bcrypt
- HTTP-only cookies with secure options
- JWT token authentication
- Input validation and sanitization
- CORS protection with configurable origin
- Secure cookie options (httpOnly, secure, sameSite)
- PostgreSQL with type-safe Prisma client

## Development

- Run tests: `pnpm test`
- Format code: `pnpm format`
- Lint code: `pnpm lint`

## Docker Support

The application includes Docker support for containerized deployment. Build and run using:

```bash
docker build -t golding-backend .
docker run -p 8000:8000 golding-backend
