import { Router } from 'express';
import { getUserList, getUser, createUser, updateUser, deleteUser } from '../controllers/user-controller';

import { auth } from '../../middleware/auth';

const userRouter = Router();


userRouter
    .get('/', auth, getUserList)
    .get('/:id', auth, getUser)
    .post('/', auth, createUser)
    .put('/:id', auth, updateUser)
    .delete('/:id', auth, deleteUser);

export default userRouter;