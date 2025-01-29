# Express.js Authentication API

A secure authentication API built with Express.js and TypeScript.

## Features

- User authentication with JWT
- Protected routes
- Secure password hashing
- HTTP-only cookies for token storage
- TypeScript support
- Input validation with Zod

## Authentication Flow

1. User registers with first name, last name, email, and password
2. Password is hashed using bcrypt
3. User logs in with email and password
4. Server validates credentials and issues JWT
5. JWT is stored in HTTP-only cookie
6. Protected routes verify JWT token
7. Access granted/denied based on token validity

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a .env file:

   ```
   PORT=3000
   JWT_SECRET=your-secret-key
   CORS_ORIGIN=http://localhost:5173
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

## API Endpoints

### POST /api/register

Register a new user

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

```json
{
  "email": "user123@example.com",
  "password": "password123"
}
```

### GET /api/protected

Protected route requiring authentication

## Security Features

- Password hashing with bcrypt
- HTTP-only cookies
- JWT token authentication
- Input validation
- CORS protection
- Secure cookie options
