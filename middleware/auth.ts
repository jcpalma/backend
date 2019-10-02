
import { Request, Response, NextFunction } from 'express';
import { SEED } from '../config/config';
import { IUser } from '../src/models/user-model';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            authUser?: IUser
        }
    }
}

/**
 * * Borrar un usuario.
 * @param req request header
 * @param res response body.
 * @param next 
 */
export function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.query.token;
    // verifica el token
    jwt.verify(token, SEED, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token no valido.',
                errors: err
            });
        }
        req.authUser = <IUser>decoded.user;
        next();
    });
}