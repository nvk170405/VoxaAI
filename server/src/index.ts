import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDatabase } from './config/database.js';
import { initializeFirebase } from './config/firebase.js';
import { journalRoutes, moodRoutes, goalRoutes } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// API routes
app.use('/api/journals', journalRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/goals', goalRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDatabase();

        // Initialize Firebase Admin
        initializeFirebase();

        app.listen(PORT, () => {
            console.log(`
🚀 VoxaAI Server is running!
📍 URL: http://localhost:${PORT}
📊 Health: http://localhost:${PORT}/health
🔥 Firebase: Initialized
🍃 MongoDB: Connected
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
