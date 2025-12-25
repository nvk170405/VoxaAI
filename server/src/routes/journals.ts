import { Router } from 'express';
import { Journal } from '../models/index.js';
import { authMiddleware, asyncHandler, createError } from '../middleware/index.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/journals
 * Get all journals for the authenticated user
 */
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const { page = 1, limit = 20, mood, sentiment, search, startDate, endDate } = req.query;

        const query: Record<string, unknown> = { userId: req.user!.uid };

        // Filters
        if (mood) query.mood = mood;
        if (sentiment) query.sentiment = sentiment;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) (query.date as Record<string, unknown>).$gte = new Date(startDate as string);
            if (endDate) (query.date as Record<string, unknown>).$lte = new Date(endDate as string);
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { transcription: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search as string, 'i')] } },
            ];
        }

        const total = await Journal.countDocuments(query);
        const journals = await Journal.find(query)
            .sort({ date: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean();

        res.json({
            success: true,
            data: journals,
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
 * GET /api/journals/:id
 * Get a specific journal by ID
 */
router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const journal = await Journal.findOne({
            _id: req.params.id,
            userId: req.user!.uid,
        }).lean();

        if (!journal) {
            throw createError('Journal not found', 404);
        }

        res.json({
            success: true,
            data: journal,
        });
    })
);

/**
 * POST /api/journals
 * Create a new journal
 */
router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { title, transcription, audioUrl, date, mood, tags, sentiment } = req.body;

        if (!title || !transcription) {
            throw createError('Title and transcription are required', 400);
        }

        const journal = await Journal.create({
            userId: req.user!.uid,
            title,
            transcription,
            audioUrl,
            date: date ? new Date(date) : new Date(),
            mood,
            tags: tags || [],
            sentiment,
        });

        res.status(201).json({
            success: true,
            data: journal,
        });
    })
);

/**
 * PUT /api/journals/:id
 * Update a journal
 */
router.put(
    '/:id',
    asyncHandler(async (req, res) => {
        const { title, transcription, audioUrl, date, mood, tags, sentiment } = req.body;

        const journal = await Journal.findOneAndUpdate(
            { _id: req.params.id, userId: req.user!.uid },
            {
                ...(title && { title }),
                ...(transcription && { transcription }),
                ...(audioUrl !== undefined && { audioUrl }),
                ...(date && { date: new Date(date) }),
                ...(mood !== undefined && { mood }),
                ...(tags !== undefined && { tags }),
                ...(sentiment !== undefined && { sentiment }),
            },
            { new: true, runValidators: true }
        ).lean();

        if (!journal) {
            throw createError('Journal not found', 404);
        }

        res.json({
            success: true,
            data: journal,
        });
    })
);

/**
 * DELETE /api/journals/:id
 * Delete a journal
 */
router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
        const journal = await Journal.findOneAndDelete({
            _id: req.params.id,
            userId: req.user!.uid,
        });

        if (!journal) {
            throw createError('Journal not found', 404);
        }

        res.json({
            success: true,
            message: 'Journal deleted successfully',
        });
    })
);

/**
 * GET /api/journals/stats
 * Get journal statistics
 */
router.get(
    '/stats/summary',
    asyncHandler(async (req, res) => {
        const userId = req.user!.uid;

        const [totalCount, moodStats, recentCount] = await Promise.all([
            Journal.countDocuments({ userId }),
            Journal.aggregate([
                { $match: { userId, mood: { $ne: null } } },
                { $group: { _id: '$mood', count: { $sum: 1 } } },
            ]),
            Journal.countDocuments({
                userId,
                date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            }),
        ]);

        res.json({
            success: true,
            data: {
                totalJournals: totalCount,
                journalsThisWeek: recentCount,
                moodBreakdown: moodStats.reduce((acc, { _id, count }) => {
                    acc[_id] = count;
                    return acc;
                }, {} as Record<string, number>),
            },
        });
    })
);

export default router;
