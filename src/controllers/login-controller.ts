import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user-model';
import { SEED, CLIENT_ID, TOKEN_EXPIRATION } from '../../config/config';
import { OAuth2Client } from 'google-auth-library';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';



/**
 * 
 */
export interface ILoginUser {
    email: string;
    password: string;
}

/**
 * * Realiza el inicio de sesión de un usuario.
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
        const token = jwt.sign({ user: user }, SEED, { expiresIn: TOKEN_EXPIRATION });


        return res.status(200).json({
            ok: true,
            message: 'Login OK',
            id: user._id,
            token: token
        });

    });
};

const client = new OAuth2Client(CLIENT_ID);

/**
 * * Obtener el listado de todos los usuarios.
 * @param req request header.
 * @param res response body.
 * @param next 
 */
export async function googleLogin(req: Request, res: Response, next: NextFunction) {

    const token = req.body.token;

    try {
        const googleInfo: any = await verifyGoogleToken(token);

        const user = <IUser>await User.findOne({ email: googleInfo.email })
            .exec()
            .catch(err => {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al autentificar con Google. - findOne',
                    errors: err
                });
            });

        if (user.google === false) {
            return res.status(400).json({
                ok: false,
                message: 'Error al hacer login.',
                errors: { message: 'Debe usar su autentificación normal' }
            });
        } else if (user) {
            user.password = '';
            const token = jwt.sign({ user: user }, SEED, { expiresIn: TOKEN_EXPIRATION });
            return res.status(200).json({
                ok: true,
                message: 'Login OK',
                id: user._id,
                token: token
            });
        } else if (!user) {
            const goUser: IUser = new User({
                name: googleInfo.name,
                email: googleInfo.email,
                password: bcrypt.hashSync(googleInfo.password, 10),
                img: googleInfo.img,
                google: true
            });

            // Guarda el usuario en la base de datos.
            const saveUser = <IUser>await goUser.save()
                .catch(err => {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al hacer login. - creando nuevo usuario',
                        errors: err
                    });
                });

            // Genera el token
            saveUser.password = '';
            const token = jwt.sign({ user: saveUser }, SEED, { expiresIn: TOKEN_EXPIRATION });
            return res.status(200).json({
                ok: true,
                message: 'Login OK',
                id: saveUser._id,
                token: token
            });
        }
    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Error al autentificar con Google.',
            errors: error
        });
    }
}

/**
 * * Verificación del ID Token de Google.
 * @param token es el ID Toekn de Google.
 */
async function verifyGoogleToken(token: string) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload: TokenPayload = <TokenPayload>ticket.getPayload();
    return {
        name: payload!.name,
        email: payload!.email,
        img: payload!.picture,
        password: payload.sub
    };
}