import { cleanEnv, str, port, url } from 'envalid';

export const env = cleanEnv(process.env, {
  // Server
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PORT: port({ default: 8000 }),
  
  // Database
  DATABASE_URL: url(),
  
  // Security
  JWT_SECRET: str({
    desc: 'Secret key for JWT token generation',
    example: 'your-secure-jwt-secret'
  }),
  
  // CORS
  CORS_ORIGIN: str({
    desc: 'Allowed CORS origin',
    example: 'http://localhost:5173',
    default: 'http://localhost:5173'
  }),
});

// Export typed environment variables
export type Env = typeof env;
