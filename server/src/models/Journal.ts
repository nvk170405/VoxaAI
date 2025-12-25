import mongoose, { Schema, Document } from 'mongoose';

export interface IJournal extends Document {
    userId: string;
    title: string;
    transcription: string;
    audioUrl?: string;
    date: Date;
    mood?: string;
    tags: string[];
    sentiment?: 'positive' | 'negative' | 'neutral';
    wordCount?: number;
    createdAt: Date;
    updatedAt: Date;
}

const JournalSchema = new Schema<IJournal>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        transcription: {
            type: String,
            required: true,
        },
        audioUrl: {
            type: String,
            default: null,
        },
        date: {
            type: Date,
            default: Date.now,
            index: true,
        },
        mood: {
            type: String,
            enum: ['happy', 'calm', 'excited', 'sad', 'angry', 'anxious', 'grateful'],
            default: null,
        },
        tags: {
            type: [String],
            default: [],
        },
        sentiment: {
            type: String,
            enum: ['positive', 'negative', 'neutral'],
            default: null,
        },
        wordCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient user queries
JournalSchema.index({ userId: 1, date: -1 });
JournalSchema.index({ userId: 1, mood: 1 });
JournalSchema.index({ userId: 1, tags: 1 });

// Pre-save hook to calculate word count
JournalSchema.pre('save', function (next) {
    if (this.isModified('transcription')) {
        this.wordCount = this.transcription.split(/\s+/).filter(Boolean).length;
    }
    next();
});

export const Journal = mongoose.model<IJournal>('Journal', JournalSchema);
