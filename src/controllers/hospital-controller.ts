import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user-model';
import Hospital, { IHospital } from '../models/hospital-model';
import { Types } from 'mongoose';


/**
 * * Obtener el listado de todos los hospitales.
 * @param req request header.
 * @param res response body.
 * @param next 
 */
export function getHospitalList(req: Request, res: Response, next: NextFunction) {

    const offset: number = Number.parseInt(req.query.offset) || 0;
    const fetch: number = Number.parseInt(req.query.fetch) || 5;

    Hospital.find({}, { __v: 0 })
        .skip(offset)
        .limit(fetch)
        .populate('userId', 'name email')
        .exec((err, hospitals) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al obtener el listado de hospitales.',
                    errors: err
                });
            }
            Hospital.count({}, (err, count) => {
                return res.status(200).json({
                    ok: true,
                    total: count,
                    fetch: hospitals.length,
                    hospitals: hospitals
                });
            });
        });
}

/**
 * * Obtener un hospital.
 * @param req request header.
 * @param res response body.
 * @param next 
 */
export function getHospital(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    // Valida que el Id sea valido para MongoDB.
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            ok: false,
            message: 'Error al obtener hospital.',
            errors: { message: `${id} es un id invalido.` }
        });
    }

    Hospital.findById(id, { __v: 0 })
        .populate('userId', 'name email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al obtener hospital.',
                    error: err
                });
            }
            // El hospital no existe.
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al obtener el hospital.',
                    errors: { message: `El hospital '${id}' no existe.` }
                });
            }
            // Devuelve el hospital
            res.status(200).json({
                ok: true,
                message: 'Hospital devuelto.',
                hospital: hospital
            });
        });
}

/**
 * * Crea un nuevo hospital.
 * @param req request header.
 * @param res response body.
 * @param next 
 */
export function createHospital(req: Request, res: Response, next: NextFunction) {

    const { name, img } = req.body;
    const user: IUser = <IUser>req.authUser;

    const hospital: IHospital = new Hospital({
        name: name,
        img: img,
        userId: user._id
    });

    hospital.save((err, newHospital) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear hospital.',
                errors: err.errors
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Hospital creado.',
            hospital: newHospital
        });

    });

}

/**
 * * Modifica el nombre o la imagen de un hospital.
 * @param req request header.
 * @param res response body.
 * @param next 
 */
export function updateHospital(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    // Valida que el Id sea valido para MongoDB.
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            ok: false,
            message: 'Error al obtener hospital.',
            errors: { message: `${id} es un id invalido.` }
        });
    }

    let fields = {
        name: req.body.name
    }
    // Opciones 
    let options = {
        new: true,
        select: 'name img userId',
        runValidators: true
    }

    Hospital.findByIdAndUpdate(id, fields, options, (err, saveHospital) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al actualizar hospital.',
                errors: err
            });
        }

        if (!saveHospital) {
            return res.status(400).json({
                ok: false,
                message: 'Error al actualizar hospital.',
                errors: { message: `El hospital '${id}' no existe.` }
            });
        }

        res.status(200).json({
            ok: true,
            message: 'Hospital actualizado.',
            user: saveHospital
        });
    });
}

/**
 * * Borra un hospital.
 * @param req request header.
 * @param res response body.
 * @param next 
 */
export function deleteHospital(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    // Valida que el Id sea valido para MongoDB.
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            ok: false,
            message: 'Error al obtener hospital.',
            errors: { message: `${id} es un id invalido.` }
        });
    }

    Hospital.findByIdAndRemove(id, (err, delHospital) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al borrar hospital.',
                error: err
            });
        }
        // Si el hospital no existe.
        if (!delHospital) {
            return res.status(400).json({
                ok: false,
                message: 'Error al borrar hospital.',
                errors: { message: `El hospital '${id}' no existe.` }
            });
        }
        // Responde que el hospital fue eliminado exitosamente.
        res.status(200).json({
            ok: true,
            message: 'Hospital eliminado.',
            hospital: delHospital
        });
    });
}