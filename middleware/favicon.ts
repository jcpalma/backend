import { Request, Response, NextFunction } from 'express';

/**
 * Captura la petición de favicon.ico.
 * @param req 
 * @param res 
 * @param next 
 */
export function ignoreFavicon(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({ ok: true });
    } else {
        next();
    }
}
