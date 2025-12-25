import { Router } from 'express';
import { Mood } from '../models/index.js';
import { authMiddleware, asyncHandler, createError } from '../middleware/index.js';

const router = Router();

router.use(authMiddleware);

/**
 * GET /api/moods
 * Get all moods for the authenticated user
 */
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const { page = 1, limit = 30, startDate, endDate } = req.query;

        const query: Record<string, unknown> = { userId: req.user!.uid };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) (query.date as Record<string, unknown>).$gte = new Date(startDate as string);
            if (endDate) (query.date as Record<string, unknown>).$lte = new Date(endDate as string);
        }

        const total = await Mood.countDocuments(query);
        const moods = await Mood.find(query)
            .sort({ date: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean();

        res.json({
            success: true,
            data: moods,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    })
);

/**
 * GET /api/moods/today
 * Get today's mood if logged
 */
router.get(
    '/today',
    asyncHandler(async (req, res) => {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const mood = await Mood.findOne({
            userId: req.user!.uid,
            date: { $gte: startOfDay, $lte: endOfDay },
        }).lean();

        res.json({
            success: true,
            data: mood,
        });
    })
);

/**
 * POST /api/moods
 * Log a new mood
 */
router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { mood, intensity, notes, date, sentiment } = req.body;

        if (!mood || !intensity) {
            throw createError('Mood and intensity are required', 400);
        }

        if (intensity < 1 || intensity > 10) {
            throw createError('Intensity must be between 1 and 10', 400);
        }

        const newMood = await Mood.create({
            userId: req.user!.uid,
            mood,
            intensity,
            notes,
            date: date ? new Date(date) : new Date(),
            sentiment,
        });

        res.status(201).json({
            success: true,
            data: newMood,
        });
    })
);

/**
 * DELETE /api/moods/:id
 * Delete a mood entry
 */
router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
        const mood = await Mood.findOneAndDelete({
            _id: req.params.id,
            userId: req.user!.uid,
        });

        if (!mood) {
            throw createError('Mood not found', 404);
        }

        res.json({
            success: true,
            message: 'Mood deleted successfully',
        });
    })
);

/**
 * GET /api/moods/stats
 * Get mood statistics
 */
router.get(
    '/stats/summary',
    asyncHandler(async (req, res) => {
        const userId = req.user!.uid;
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const [moodCounts, avgIntensity, streak] = await Promise.all([
            // Mood distribution
            Mood.aggregate([
                { $match: { userId, date: { $gte: thirtyDaysAgo } } },
                { $group: { _id: '$mood', count: { $sum: 1 } } },
            ]),
            // Average intensity
            Mood.aggregate([
                { $match: { userId, date: { $gte: thirtyDaysAgo } } },
                { $group: { _id: null, avgIntensity: { $avg: '$intensity' } } },
            ]),
            // Calculate streak (days in a row with mood logged)
            Mood.distinct('date', { userId })
                .then((dates) => {
                    let currentStreak = 0;
                    const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

                    for (let i = 0; i < sortedDates.length; i++) {
                        const date = new Date(sortedDates[i]);
                        const expectedDate = new Date();
                        expectedDate.setDate(expectedDate.getDate() - i);

                        if (date.toDateString() === expectedDate.toDateString()) {
                            currentStreak++;
                        } else {
                            break;
                        }
                    }
                    return currentStreak;
                }),
        ]);

        const positiveMoods = ['happy', 'calm', 'excited', 'grateful'];
        const positiveCount = moodCounts
            .filter(m => positiveMoods.includes(m._id))
            .reduce((sum, m) => sum + m.count, 0);
        const totalCount = moodCounts.reduce((sum, m) => sum + m.count, 0);

        res.json({
            success: true,
            data: {
                positivePercentage: totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0,
                averageIntensity: avgIntensity[0]?.avgIntensity ? Math.round(avgIntensity[0].avgIntensity * 10) / 10 : 0,
                streak,
                moodBreakdown: moodCounts.reduce((acc, { _id, count }) => {
                    acc[_id] = count;
                    return acc;
                }, {} as Record<string, number>),
            },
        });
    })
);

export default router;
