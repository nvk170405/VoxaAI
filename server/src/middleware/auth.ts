import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/firebase.js';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                uid: string;
                email?: string;
            };
        }
    }
}

/**
 * Middleware to verify Firebase ID token
 */
export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized - No token provided',
            });
            return;
        }

        const token = authHeader.split('Bearer ')[1];

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized - Invalid token format',
            });
            return;
        }

        const decodedToken = await verifyToken(token);

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            error: 'Unauthorized - Invalid token',
        });
    }
};

/**
 * Optional auth middleware - doesn't block if no token
 */
export const optionalAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split('Bearer ')[1];
            if (token) {
                const decodedToken = await verifyToken(token);
                req.user = {
                    uid: decodedToken.uid,
                    email: decodedToken.email,
                };
            }
        }

        next();
    } catch (error) {
        // Continue without auth
        next();
    }
};
