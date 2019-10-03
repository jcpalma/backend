import { Request, Response, NextFunction } from 'express';
import Hospital from '../models/hospital-model';
import Doctor from '../models/doctor-model';
import User from '../models/user-model';


/**
 * * Obtiene el listado de todos los doctores, hospitales y usuarios.
 * @param req request header. 
 * @param res response body.
 */
export function findAll(req: Request, res: Response) {

    const search = req.params.search;
    const regexp = RegExp(search, 'i');

    Promise.all([
        Hospital.find({ name: regexp }, { __v: 0 })
            .populate('user', 'name email')
            .exec(),
        Doctor.find({ name: regexp }, { __v: 0 })
            .populate('user', 'name email')
            .populate('hospital', 'name')
            .exec(),
        User.find({}, 'name email role')
            .or([{ name: regexp }, { email: regexp }])
            .exec()
    ]).then(result => {
        return res.status(200).json({
            ok: true,
            hospitals: result[0],
            doctors: result[1],
            users: result[2]
        });
    }).catch(err => {
        return res.status(400).json({
            ok: false,
            message: 'Error al buscar.',
            errors: err
        });
    });
}

/**
 * * Busca en la collección de doctores.
 * @param req request header. 
 * @param res response body.
 */
export function findDoctor(req: Request, res: Response) {
    const regexp = RegExp(req.params.search, 'i');


    Doctor.find({ name: regexp }, { __v: 0 })
        .populate('user', 'name email')
        .populate('hospital', 'name')
        .exec()
        .then(doctors => {
            return res.status(200).json({
                ok: true,
                doctors: doctors
            });
        }).catch(err => {
            return res.status(400).json({
                ok: false,
                message: 'Error al buscar en doctores.',
                errors: err
            });
        });
}

/**
 * * Busca en la collección de hospitales.
 * @param req request header. 
 * @param res response body.
 */
export function findHospital(req: Request, res: Response) {
    const regexp = RegExp(req.params.search, 'i');

    Hospital.find({ name: regexp }, { __v: 0 })
        .populate('user', 'name email')
        .exec()
        .then(hospitals => {
            return res.status(200).json({
                ok: true,
                hospitals: hospitals
            });
        }).catch(err => {
            return res.status(400).json({
                ok: false,
                message: 'Error al buscar en hospitales.',
                errors: err
            });
        });

}

/**
 * * Busca en la collección de usuarios.
 * @param req request header. 
 * @param res response body.
 */
export function findUser(req: Request, res: Response) {
    const regexp = RegExp(req.params.search, 'i');

    User.find({}, 'name email role')
        .or([{ name: regexp }, { email: regexp }])
        .exec()
        .then(users => {
            return res.status(200).json({
                ok: true,
                users: users
            });
        }).catch(err => {
            return res.status(400).json({
                ok: false,
                message: 'Error al buscar en usuarios.',
                errors: err
            });
        });
}