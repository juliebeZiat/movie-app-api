import express from 'express';
import jwtMiddleware from '../middleware/jwtMiddleware';
import userController from './user.controller';

const userRouter = express.Router();

userRouter.get('/list', jwtMiddleware, userController.getUserList);

export default userRouter;
