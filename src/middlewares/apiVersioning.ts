import { Request, Response, NextFunction } from 'express';

export const version = (req: Request, res: Response, next: NextFunction) => {
    if (req.url.startsWith(`/api/${process.env.VERSION}`)) {
        next();
    } else if (req.url.startsWith('/api')) {
        res.status(400).json({
            success: false,
            message: `This API version is not supported. Please use /api/${process.env.VERSION}`
        });
    } else {
        next(); // Allow non-API routes to pass through
    }
}
