import { Router } from 'express';
import fileUpload from 'express-fileupload';
import { auth } from '../../middleware/auth';
import { uploadImage } from '../controllers/upload-controller';

const uploadRouter = Router();

uploadRouter
    .use(fileUpload())
    .put('/users/:id', uploadImage)
    .put('/doctors/:id', uploadImage)
    .put('/hospitals/:id', uploadImage)
    ;

export default uploadRouter;