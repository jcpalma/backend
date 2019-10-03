import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Doctor, { IDoctor } from '../models/doctor-model';
import { IUser } from '../models/user-model';

/**
 * * Obtiene el listado de todos los doctores.
 * @param req request header. 
 * @param res response body.
 */
export function getDoctorList(req: Request, res: Response) {

    const offset: number = Number.parseInt(req.query.offset) || 0;
    const fetch: number = Number.parseInt(req.query.fetch) || 5;

    Doctor.find({}, { __v: 0 })
        .skip(offset)
        .limit(fetch)
        .populate('user', 'name email')
        .populate('hospital', { __v: 0 })
        .exec((err, doctors) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al obtener el listado de doctores.',
                    errors: err
                });
            }
            Doctor.count({}, (err, count) => {
                return res.status(200).json({
                    ok: true,
                    total: count,
                    fetch: doctors.length,
                    doctors: doctors
                });
            });
        });
}

/**
 * * Obtiene un doctor.
 * @param req request header. 
 * @param res response body.
 */
export function getDoctor(req: Request, res: Response) {
    const id = req.params.id;

    // Valida que el Id sea valido para MongoDB.
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            ok: false,
            message: 'Error al obtener doctor.',
            errors: { message: `${id} es un id invalido.` }
        });
    }

    Doctor.findById(id, { __v: 0 })
        .populate('user', 'name email')
        .populate('hospital', { __v: 0 })
        .exec((err, doctor) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al obtener doctor.',
                    error: err
                });
            }
            // El doctor no existe.
            if (!doctor) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al obtener doctor.',
                    errors: { message: `El doctor '${id}' no existe.` }
                });
            }
            // Devuelve el doctor.
            res.status(200).json({
                ok: true,
                message: 'Doctor devuelto.',
                doctor: doctor
            });
        });
}

/**
 * * Crea un doctor.
 * @param req request header. 
 * @param res response body.
 */
export function createDoctor(req: Request, res: Response) {
    const { name, img, hospital } = req.body;
    const user: IUser = <IUser>req.authUser;

    const doctor: IDoctor = new Doctor({
        name: name,
        img: img,
        user: user._id,
        hospital: hospital
    });

    doctor.save((err, newDoctor) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear doctor.',
                errors: err.errors
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Doctor creado.',
            doctor: newDoctor
        });

    });
}

/**
 * * Actualiza el nombre o la imagen o el hospital de un doctor.
 * @param req request header. 
 * @param res response body.
 */
export function updateDoctor(req: Request, res: Response) {
    const id = req.params.id;

    // Valida que el Id sea valido para MongoDB.
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            ok: false,
            message: 'Error al obtener doctor.',
            errors: { message: `${id} es un id invalido.` }
        });
    }

    let fields: any = {}
    if (req.body.name) { fields.name = req.body.name; }
    if (req.body.hospital) { fields.hospital = req.body.hospital; }

    // Opciones 
    let options = {
        new: true,
        select: 'name img user hospital',
        runValidators: true
    }

    Doctor.findByIdAndUpdate(id, fields, options, (err, saveDoctor) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al actualizar doctor.',
                errors: err
            });
        }

        if (!saveDoctor) {
            return res.status(400).json({
                ok: false,
                message: 'Error al actualizar doctor.',
                errors: { message: `El doctor '${id}' no existe.` }
            });
        }

        res.status(200).json({
            ok: true,
            message: 'Doctor actualizado.',
            doctor: saveDoctor
        });
    });
}

/**
 * * Borra un doctor.
 * @param req request header. 
 * @param res response body.
 */
export function deleteDoctor(req: Request, res: Response) {
    const id = req.params.id;

    // Valida que el Id sea valido para MongoDB.
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            ok: false,
            message: 'Error al obtener doctor.',
            errors: { message: `${id} es un id invalido.` }
        });
    }

    Doctor.findByIdAndRemove(id, (err, delDoctor) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al borrar doctor.',
                error: err
            });
        }
        // Si el doctor no existe.
        if (!delDoctor) {
            return res.status(400).json({
                ok: false,
                message: 'Error al borrar doctor.',
                errors: { message: `El Doctor '${id}' no existe.` }
            });
        }
        // Responde que el doctor fue eliminado exitosamente.
        res.status(200).json({
            ok: true,
            message: 'Doctor eliminado.',
            doctor: delDoctor
        });
    });
}