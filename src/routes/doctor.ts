import { Router } from 'express';
import { auth } from '../../middleware/auth';
import {
    getDoctorList,
    getDoctor,
    createDoctor,
    updateDoctor,
    deleteDoctor
} from '../controllers/doctor-controller';

const doctorRouter = Router();

// Definición de los Endpoints (CRUD)
doctorRouter
    .get('/', getDoctorList)
    .get('/:id', auth, getDoctor)
    .post('/', auth, createDoctor)
    .put('/:id', auth, updateDoctor)
    .delete('/:id', auth, deleteDoctor);

export default doctorRouter;