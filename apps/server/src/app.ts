import express from 'express';

// Create an Express application
export const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2mb' }));