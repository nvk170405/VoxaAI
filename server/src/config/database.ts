import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

export const connectDatabase = async (): Promise<void> => {
    try {
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};

export const disconnectDatabase = async (): Promise<void> => {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
};
