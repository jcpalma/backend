import { Router } from 'express';
import { auth } from '../../middleware/auth';
import {
    getHospitalList,
    getHospital,
    createHospital,
    updateHospital,
    deleteHospital
} from '../controllers/hospital-controller';

const hospitalRouter = Router();

// Definición de los Endpoints (CRUD)
hospitalRouter
    .get('/', getHospitalList)
    .get('/:id', auth, getHospital)
    .post('/', auth, createHospital)
    .put('/:id', auth, updateHospital)
    .delete('/:id', auth, deleteHospital);

export default hospitalRouter;