import { Router } from 'express';
import { Goal } from '../models/index.js';
import { authMiddleware, asyncHandler, createError } from '../middleware/index.js';

const router = Router();

router.use(authMiddleware);

/**
 * GET /api/goals
 * Get all goals for the authenticated user
 */
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const { status, category } = req.query;

        const query: Record<string, unknown> = { userId: req.user!.uid };

        if (status) query.status = status;
        if (category) query.category = category;

        const goals = await Goal.find(query)
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            data: goals,
        });
    })
);

/**
 * GET /api/goals/:id
 * Get a specific goal by ID
 */
router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const goal = await Goal.findOne({
            _id: req.params.id,
            userId: req.user!.uid,
        }).lean();

        if (!goal) {
            throw createError('Goal not found', 404);
        }

        res.json({
            success: true,
            data: goal,
        });
    })
);

/**
 * POST /api/goals
 * Create a new goal
 */
router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { title, description, category, target, deadline, milestones } = req.body;

        if (!title || !category) {
            throw createError('Title and category are required', 400);
        }

        const goal = await Goal.create({
            userId: req.user!.uid,
            title,
            description,
            category,
            target: target || 100,
            deadline: deadline ? new Date(deadline) : null,
            milestones: milestones || [],
        });

        res.status(201).json({
            success: true,
            data: goal,
        });
    })
);

/**
 * PUT /api/goals/:id
 * Update a goal
 */
router.put(
    '/:id',
    asyncHandler(async (req, res) => {
        const { title, description, category, progress, target, deadline, status, milestones } = req.body;

        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (progress !== undefined) updateData.progress = progress;
        if (target !== undefined) updateData.target = target;
        if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
        if (status !== undefined) updateData.status = status;
        if (milestones !== undefined) updateData.milestones = milestones;

        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, userId: req.user!.uid },
            updateData,
            { new: true, runValidators: true }
        ).lean();

        if (!goal) {
            throw createError('Goal not found', 404);
        }

        res.json({
            success: true,
            data: goal,
        });
    })
);

/**
 * PATCH /api/goals/:id/progress
 * Update goal progress
 */
router.patch(
    '/:id/progress',
    asyncHandler(async (req, res) => {
        const { progress } = req.body;

        if (progress === undefined || progress < 0) {
            throw createError('Valid progress value is required', 400);
        }

        const goal = await Goal.findOne({
            _id: req.params.id,
            userId: req.user!.uid,
        });

        if (!goal) {
            throw createError('Goal not found', 404);
        }

        goal.progress = progress;

        // Auto-complete if progress reaches target
        if (progress >= goal.target && goal.status === 'active') {
            goal.status = 'completed';
        }

        await goal.save();

        res.json({
            success: true,
            data: goal,
        });
    })
);

/**
 * DELETE /api/goals/:id
 * Delete a goal
 */
router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
        const goal = await Goal.findOneAndDelete({
            _id: req.params.id,
            userId: req.user!.uid,
        });

        if (!goal) {
            throw createError('Goal not found', 404);
        }

        res.json({
            success: true,
            message: 'Goal deleted successfully',
        });
    })
);

/**
 * GET /api/goals/stats/summary
 * Get goal statistics
 */
router.get(
    '/stats/summary',
    asyncHandler(async (req, res) => {
        const userId = req.user!.uid;

        const [stats, categoryBreakdown] = await Promise.all([
            Goal.aggregate([
                { $match: { userId } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        avgProgress: { $avg: '$progress' },
                    },
                },
            ]),
            Goal.aggregate([
                { $match: { userId } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
            ]),
        ]);

        const statusMap = stats.reduce((acc, item) => {
            acc[item._id] = { count: item.count, avgProgress: Math.round(item.avgProgress) };
            return acc;
        }, {} as Record<string, { count: number; avgProgress: number }>);

        res.json({
            success: true,
            data: {
                total: Object.values(statusMap).reduce((sum, s) => sum + s.count, 0),
                active: statusMap.active?.count || 0,
                completed: statusMap.completed?.count || 0,
                paused: statusMap.paused?.count || 0,
                averageProgress: statusMap.active?.avgProgress || 0,
                categoryBreakdown: categoryBreakdown.reduce((acc, { _id, count }) => {
                    acc[_id] = count;
                    return acc;
                }, {} as Record<string, number>),
            },
        });
    })
);

export default router;
