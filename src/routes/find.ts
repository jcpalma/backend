import { Router } from 'express';
import { findAll, findDoctor, findHospital, findUser } from '../controllers/find-controller';
import { auth } from '../../middleware/auth';

const findRouter = Router();

findRouter
    .get('/all/:search', auth, findAll)
    .get('/doctors/:search', auth, findDoctor)
    .get('/hospitals/:search', auth, findHospital)
    .get('/users/:search', auth, findUser);

export default findRouter;