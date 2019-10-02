
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose'
import User, { IUser } from '../models/user-model';


/**
 * * Obtener el listado de todos los usuarios.
 * @param req request header.
 * @param res response body.
 * @param next 
 */
export function getUserList(req: Request, res: Response, next: NextFunction) {
    // También se puede indicar los campos que se devuelven estableciendo el valor a 1.
    User.find({}, { password: 0, __v: 0 }, (err, users) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al obtener el listado de usuarios.',
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            users: users
        });
    });
};

/**
 * * Obtiene un usuario específico.
 * @param req request header.
 * @param res response body.
 * @param next 
 */
export function getUser(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    // Valida que el Id sea valido para MongoDB.
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            ok: false,
            message: 'Error al obtener usuario.',
            errors: { message: `${id} es un id invalido.` }
        });
    }

    User.findById(id, { password: 0, __v: 0 }, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al obtener usuario.',
                error: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'Error al obtener el usuario.',
                errors: { message: `El usuario '${id}' no existe.` }
            });
        }

        res.status(200).json({
            ok: true,
            message: 'Usuario devuelto',
            user: user
        });

    });
}

/**
 * * Crea un nuevo usuario.
 * @param req request header
 * @param res response body.
 * @param next 
 */
export function createUser(req: Request, res: Response, next: NextFunction) {
    const body: IUser = req.body;

    const user: IUser = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, saveUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear usuario.',
                errors: err.errors
            });
        }
        // ! Filtra los campos a devolver por el response. 
        let { _id, name, email, role } = saveUser;
        res.status(201).json({
            ok: true,
            message: 'Usuario creado',
            user: { _id, name, email, role }
        });

    });
};

/**
 * * Actualiza el nombre o correo o el rol de un usuario.
 * @param req request header
 * @param res response body.
 * @param next 
 */
export function updateUser(req: Request, res: Response, next: NextFunction) {

    const id = req.params.id;

    // Valida que el Id sea valido para MongoDB.
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            ok: false,
            message: 'Error al actualizar usuario.',
            errors: { message: `${id} es un id invalido.` }
        });
    }
    // Obtiene los campos a modificar para el usuario.
    const body: IUser = req.body;

    // Valida que envien al menos un campo a actualiza.
    if (!body.name && !body.email && !body.role) {
        return res.status(400).json({
            ok: false,
            message: 'Error al actualizar usuario.',
            errors: { message: 'No se incluyeron los campos a actualizar.' }
        });
    }

    let fields: any = {};
    if (body.name) { fields.name = body.name; }
    if (body.email) { fields.email = body.email; }
    if (body.role) { fields.role = body.role; }

    // Opciones 
    let options = {
        new: true,
        select: 'name email role',
        runValidators: true
    }

    // Busca y actualiza el usuario.
    User.findByIdAndUpdate(id, fields, options, (err, saveUser) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al actualizar usuario.',
                errors: err
            });

        }

        if (!saveUser) {
            return res.status(400).json({
                ok: false,
                message: 'Error al actualizar usuario.',
                errors: { message: `El usuario '${id}' no existe.` }
            });
        }

        res.status(200).json({
            ok: true,
            message: 'Usuario actualizado.',
            user: saveUser
        });
    });

};


/**
 * * Borrar un usuario.
 * @param req request header
 * @param res response body.
 * @param next 
 */
export function deleteUser(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    // Valida que el Id sea valido para MongoDB.
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            ok: false,
            message: 'Error al actualizar usuario.',
            errors: { message: `${id} es un id invalido.` }
        });
    }

    // Opciones 
    let options = {
        select: 'name email role'
    }

    User.findByIdAndRemove(id, options, (err, delUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al borrar usuario.',
                error: err
            });
        }

        // Si el usuario no existe.
        if (!delUser) {
            return res.status(400).json({
                ok: false,
                message: 'Error al borrar usuario.',
                errors: { message: `El usuario '${id}' no existe.` }
            });
        }

        // Responde que el usuario fue eliminado exitosamente.
        res.status(200).json({
            ok: true,
            message: 'Usuario eliminado.',
            user: delUser
        });

    });
};