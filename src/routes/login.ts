import { Router } from 'express';
import { login, googleLogin } from '../controllers/login-controller';

const loginRouter = Router();

loginRouter
    .post('/', login)
    .post('/google', googleLogin);

export default loginRouter;