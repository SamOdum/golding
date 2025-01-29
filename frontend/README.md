# Vue.js Authentication Frontend

A modern authentication frontend built with Vue.js 3, TypeScript, and Tailwind CSS.

## Features

- User authentication with email and password
- Protected routes with Vue Router navigation guards
- State management using Pinia
- HTTP-only cookie based authentication
- Responsive and clean UI with Tailwind CSS
- Form validation with client-side error handling
- TypeScript for type safety
- Axios for API communication
- VueUse utilities for composition functions
- Vite for fast development and building

## Prerequisites

- Node.js and pnpm
- Backend API running (default: http://localhost:8000)

## Project Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   Create a `.env` file:
   ```
   VITE_API_URL=http://localhost:8000
   ```

3. Start development server:
   ```bash
   pnpm dev
   ```

4. Build for production:
   ```bash
   pnpm build
   ```

5. Preview production build:
   ```bash
   pnpm preview
   ```

## Available Routes

- `/` - Dashboard (protected)
- `/login` - Login page
- `/signup` - Registration page

## API Integration

The API integration is handled through the auth store (`src/stores/auth.ts`):

### Endpoints

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `GET /api/protected` - Get current user data

### Authentication Store Features

- Automatic authentication check on app start
- Loading states for async operations
- Error handling and messages
- Type-safe state management
- Persistent session handling

## Security Features

- HTTP-only cookies for token storage
- Protected route navigation guards
- Input validation before API calls
- Secure session management
- Automatic token verification
- Error boundary handling

## Development Tools

- TypeScript for type checking
- Vite for fast development
- Vue Router for routing
- Tailwind CSS for styling
- Axios for API requests
- Pinia for state management

## Browser Support

Supports all modern browsers:
- Chrome
- Firefox
- Safari
- Edge
