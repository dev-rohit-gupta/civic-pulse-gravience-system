import express from 'express';
import cookieParser from 'cookie-parser';
// Create an Express application
export const app = express();

// Middleware to parse JSON bodies
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2mb' , type: 'application/json' }));