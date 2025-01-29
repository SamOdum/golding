import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/auth.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Welcome route - serves both HTML and JSON based on Accept header
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.json({
      message: 'Welcome to the Authentication API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/login, /api/register, /api/protected',
        health: '/health'
      }
    });
  }
});

// Routes
app.use('/api', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});