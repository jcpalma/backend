import { Request, Response } from 'express';
import uudi from 'uuid/v4';
import User, { IUser } from '../models/user-model';
import Hospital from '../models/hospital-model';
import Doctor from '../models/doctor-model';
import fileUpload from 'express-fileupload';
import fs from 'fs';

/**
 * 
 * @param req 
 * @param res response body.
 */
export function uploadImage(req: Request, res: Response) {

    const tipo = req.url.split('/')[1];
    const id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'Error al actualizar imagen.',
            errors: { message: 'No se ha seleccionado una imagen.' }
        });
    }
    const image = <fileUpload.UploadedFile>(<fileUpload.FileArray>req.files).image;
    const imageName: string = image.name;
    const imageExt = imageName.split('.').pop();
    // Verifica la extensión del archivo, sólo permite imágenes.
    switch (imageExt) {
        case 'png':
        case 'jpg':
        case 'gif':
        case 'jpeg':
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'No se pudo actualizar la imagen.',
                errors: {
                    message: 'Sólo se permiten imágenes.',
                    ext: ['png', 'jpg', 'gif', 'jpeg'].join(', ')
                }
            });
    }

    const saveFileName = uudi() + `.${imageExt}`;
    const saveFilePath = `./uploads/${tipo}/`;

    //Guarda la imagen en el servidor
    image.mv(`${saveFilePath}${saveFileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo actualizar la imagen.',
                errors: err
            });
        }
        //Asignar la imagen a la colección (users, doctors, hospitals)
        if (tipo === 'users') {
            updateUserImage(id, saveFilePath, saveFileName, res);
        } else if (tipo === 'hospitals') {
            updateHospitalImage(id, saveFilePath, saveFileName, res);
        } else {
            updateDoctorImage(id, saveFilePath, saveFileName, res);
        }
    });
}

/**
 * * Actualiza la imagen de un usuario en la base de datos.
 * @param id es el id del usuario.
 * @param img es el nombre de la nueva imagen.
 * @param res response body.
 */
function updateUserImage(id: string, path: string, img: string, res: Response) {
    User.findByIdAndUpdate(id, { img: img }, { select: 'name email img' })
        .exec()
        .then(user => {
            if (!user) {
                if (fs.existsSync(`${path}${img}`) && img) {
                    fs.unlinkSync(`${path}${img}`);
                }
                return res.status(400).json({
                    ok: false,
                    message: 'No se pudo actualizar la imagen.',
                    errors: { message: 'Usuario no existe.' }
                });
            }
            if (fs.existsSync(`${path}${user.img}`) && user.img) {
                fs.unlinkSync(`${path}${user.img}`);
            }
            user.img = img;
            return res.status(200).json({
                ok: true,
                message: 'Imagen del usuario actualizada.',
                user: user
            });
        }).catch(err => {
            // En caso que falle el update, borra la imagen que fue subida.
            if (fs.existsSync(`${path}${img}`) && img) {
                fs.unlinkSync(`${path}${img}`);
            }
            return res.status(500).json({
                ok: false,
                message: 'No se pudo actualizar la imagen.',
                errors: err
            });
        });
}

/**
 * * Actualiza la imagen de un doctor en la base de datos.
 * @param id es el id del doctor.
 * @param img es el nombre de la nueva imagen.
 * @param res response body.
 */
function updateDoctorImage(id: string, path: string, img: string, res: Response) {
    Doctor.findByIdAndUpdate(id, { img: img })
        .populate('user', 'name email')
        .populate('hospital', 'name')
        .select({ __v: 0 })
        .exec()
        .then(doctor => {
            if (!doctor) {
                if (fs.existsSync(`${path}${img}`) && img) {
                    fs.unlinkSync(`${path}${img}`);
                }
                return res.status(400).json({
                    ok: false,
                    message: 'No se pudo actualizar la imagen.',
                    errors: { message: 'Doctor no existe.' }
                });
            }
            if (fs.existsSync(`${path}${doctor.img}`) && doctor.img) {
                fs.unlinkSync(`${path}${doctor.img}`);
            }
            doctor.img = img;
            return res.status(200).json({
                ok: true,
                message: 'Imagen del doctor actualizada.',
                doctor: doctor
            });
        }).catch(err => {
            // En caso que falle el update, borra la imagen que fue subida.
            if (fs.existsSync(`${path}${img}`) && img) {
                fs.unlinkSync(`${path}${img}`);
            }
            return res.status(500).json({
                ok: false,
                message: 'No se pudo actualizar la imagen.',
                errors: err
            });
        });
}

/**
 * * Actualiza la imagen de un hospital en la base de datos.
 * @param id es el id del hospital.
 * @param img es el nombre de la nueva imagen.
 * @param res response body.
 */
function updateHospitalImage(id: string, path: string, img: string, res: Response) {
    Hospital.findByIdAndUpdate(id, { img: img })
        .populate('user', 'name email')
        .select({ __v: 0 })
        .exec()
        .then(hospital => {
            if (!hospital) {
                if (fs.existsSync(`${path}${img}`) && img) {
                    fs.unlinkSync(`${path}${img}`);
                }
                return res.status(400).json({
                    ok: false,
                    message: 'No se pudo actualizar la imagen.',
                    errors: { message: 'hospital no existe.' }
                });
            }
            if (fs.existsSync(`${path}${hospital.img}`) && hospital.img) {
                fs.unlinkSync(`${path}${hospital.img}`);
            }
            hospital.img = img;
            return res.status(200).json({
                ok: true,
                message: 'Imagen del hospital actualizada.',
                hospital: hospital
            });
        }).catch(err => {
            // En caso que falle el update, borra la imagen que fue subida.
            if (fs.existsSync(`${path}${img}`) && img) {
                fs.unlinkSync(`${path}${img}`);
            }
            return res.status(500).json({
                ok: false,
                message: 'No se pudo actualizar la imagen.',
                errors: err
            });
        });
}