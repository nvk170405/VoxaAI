import mongoose, { Schema, Document } from 'mongoose';

export interface IMood extends Document {
    userId: string;
    mood: 'happy' | 'calm' | 'excited' | 'sad' | 'angry' | 'anxious' | 'grateful';
    intensity: number;
    notes?: string;
    date: Date;
    sentiment?: 'positive' | 'negative' | 'neutral';
    createdAt: Date;
    updatedAt: Date;
}

const MoodSchema = new Schema<IMood>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        mood: {
            type: String,
            required: true,
            enum: ['happy', 'calm', 'excited', 'sad', 'angry', 'anxious', 'grateful'],
        },
        intensity: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
        },
        notes: {
            type: String,
            default: null,
            maxlength: 500,
        },
        date: {
            type: Date,
            default: Date.now,
            index: true,
        },
        sentiment: {
            type: String,
            enum: ['positive', 'negative', 'neutral'],
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
MoodSchema.index({ userId: 1, date: -1 });
MoodSchema.index({ userId: 1, mood: 1 });

export const Mood = mongoose.model<IMood>('Mood', MoodSchema);
