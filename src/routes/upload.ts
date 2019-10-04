import { Router } from 'express';
import fileUpload from 'express-fileupload';
import { auth } from '../../middleware/auth';
import { uploadImage } from '../controllers/upload-controller';

const uploadRouter = Router();

uploadRouter
    .use(fileUpload())
    .put('/users/:id', auth, uploadImage)
    .put('/doctors/:id', auth, uploadImage)
    .put('/hospitals/:id', auth, uploadImage)
    ;

export default uploadRouter;