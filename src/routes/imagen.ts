import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { getUserImage, getDoctorImage, getHospitalImage } from '../controllers/image-controller';

const imageRouter = Router();

imageRouter
    .get('/user/:img', auth, getUserImage)
    .get('/doctor/:img', auth, getDoctorImage)
    .get('/hospital/:img', auth, getHospitalImage);

export default imageRouter;