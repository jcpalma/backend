import { Router, Request, Response, NextFunction } from 'express';

const appRouter = Router();

appRouter.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.status(200)
    res.json({
        ok: true,
        mensaje: 'OK'
    });

});

/**
 * * 
 * @param req 
 * @param res 
 * @param next 
 */
export function ignoreFavicon(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({ nope: true });
    } else {
        next();
    }
}

export default appRouter;