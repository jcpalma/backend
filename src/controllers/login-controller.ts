import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user-model';
import { SEED } from '../../config/config';


/**
 * 
 */
export interface ILoginUser {
    email: string;
    password: string;
}


/**
 * * Obtener el listado de todos los usuarios.
 * @param req request header.
 * @param res response body.
 * @param next 
 */
export function login(req: Request, res: Response, next: NextFunction) {

    const body: ILoginUser = req.body;

    User.findOne({ email: body.email }, { __v: 0 }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al hacer login.',
                errors: err.errors
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'Error al hacer login.',
                errors: { message: 'Credenciales invalida. [email]' }
            });
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Error al hacer login.',
                errors: { message: 'Credenciales invalida. [password]' }
            });
        }

        // * Generando el Token (JWT)
        user.password = '';
        const token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });


        return res.status(200).json({
            ok: true,
            message: 'Login OK',
            id: user._id,
            token: token
        });

    });
};

