import { Router, Request, Response } from 'express';

const appRouter = Router();

appRouter.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        ok: true,
        mensaje: 'OK'
    });
});

export default appRouter;