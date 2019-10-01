import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res
        .status(200)
        .send({
            ok: true,
            mensaje: 'OK'
        });

});

export default router;