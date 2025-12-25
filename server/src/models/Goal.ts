import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
    userId: string;
    title: string;
    description?: string;
    category: 'health' | 'career' | 'personal' | 'education';
    progress: number;
    target: number;
    deadline?: Date;
    status: 'active' | 'completed' | 'paused' | 'cancelled';
    milestones?: Array<{
        title: string;
        completed: boolean;
        completedAt?: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>(
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
        description: {
            type: String,
            default: null,
            maxlength: 1000,
        },
        category: {
            type: String,
            required: true,
            enum: ['health', 'career', 'personal', 'education'],
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
        },
        target: {
            type: Number,
            default: 100,
            min: 1,
        },
        deadline: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'paused', 'cancelled'],
            default: 'active',
        },
        milestones: [
            {
                title: { type: String, required: true },
                completed: { type: Boolean, default: false },
                completedAt: { type: Date, default: null },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes
GoalSchema.index({ userId: 1, status: 1 });
GoalSchema.index({ userId: 1, category: 1 });

// Virtual for progress percentage
GoalSchema.virtual('progressPercentage').get(function () {
    return Math.round((this.progress / this.target) * 100);
});

export const Goal = mongoose.model<IGoal>('Goal', GoalSchema);
