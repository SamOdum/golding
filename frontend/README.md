# Vue.js Authentication System

A secure authentication system built with Vue.js 3, TypeScript, and Tailwind CSS.

## Features

- User authentication with email and password
- Protected routes with navigation guards
- State management using Pinia
- HTTP-only cookie based authentication
- Responsive and clean UI with Tailwind CSS
- Form validation
- TypeScript support

## Authentication Flow

1. User enters credentials in the login form
2. Credentials are validated on the client side
3. If valid, credentials are sent to the backend API
4. On successful authentication:
   - Backend sets HTTP-only cookie
   - User data is stored in Pinia store
   - User is redirected to dashboard
5. Protected routes check authentication status
6. Logout clears the cookie and store state

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## API Integration

Update the API endpoints in `src/stores/auth.ts` to match your backend:

- POST /api/login - Login endpoint
- POST /api/logout - Logout endpoint
- GET /api/me - Get current user data

## Security Considerations

- Uses HTTP-only cookies for token storage
- Implements proper route guards
- Validates user input
- Handles authentication errors
- Maintains secure session management
