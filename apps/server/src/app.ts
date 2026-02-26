import express from 'express';
import cookieParser from 'cookie-parser';
import { apiRouter } from './routes/api.router.js';
// Create an Express application
export const app = express();

// Middleware to parse JSON bodies
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2mb' , type: 'application/json' }));

// Use the API router for all routes starting with /api
app.use('/api', apiRouter);