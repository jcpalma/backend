import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const noFilePath = path.resolve(__dirname, '../../assets/no-image.png');

/**
 * * Obtiene la imagen de un usuario.
 * @param req request header. 
 * @param res response body.
 */
export function getUserImage(req: Request, res: Response) {
    const img: string = req.params.img;
    const filePath = path.resolve(__dirname, `../../uploads/users/${img}`);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.sendFile(noFilePath);
    }
}

/**
 * * Obtiene la imagen de un usuario.
 * @param req request header. 
 * @param res response body.
 */
export function getDoctorImage(req: Request, res: Response) {
    const img: string = req.params.img;
    const filePath = path.resolve(__dirname, `../../uploads/doctors/${img}`);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.sendFile(noFilePath);
    }
}

/**
 * * Obtiene la imagen de un usuario.
 * @param req request header. 
 * @param res response body.
 */
export function getHospitalImage(req: Request, res: Response) {
    const img: string = req.params.img;
    const filePath = path.resolve(__dirname, `../../uploads/hospital/${img}`);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.sendFile(noFilePath);
    }
}