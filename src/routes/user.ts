import { Router } from 'express';
import { auth } from '../../middleware/auth';
import {
    getUserList,
    getUser,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/user-controller';

const userRouter = Router();

// Definición de los Endpoints (CRUD)
userRouter
    .get('/', getUserList)
    .get('/:id', auth, getUser)
    .post('/', auth, createUser)
    .put('/:id', auth, updateUser)
    .delete('/:id', auth, deleteUser);

export default userRouter;