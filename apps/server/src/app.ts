import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { apiRouter } from './routes/api.router.js';
import { errorMiddleware } from './middleware/error.middleware.js';
// Create an Express application
export const app = express();

// Configure CORS to allow credentials from the client
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON bodies
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2mb' , type: 'application/json' }));
    
// Use the error middleware for handling errors
app.use(errorMiddleware);

// Use the API router for all routes starting with /api
app.use('/api', apiRouter);