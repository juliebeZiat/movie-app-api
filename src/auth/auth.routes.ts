import express from 'express';
import jwtMiddleware from '../middleware/jwtMiddleware';
import authController from './auth.controller';

const authRouter = express.Router();

authRouter.post('/signin', authController.signIn);
authRouter.post('/signup', authController.signUp);
authRouter.get('/user', jwtMiddleware, authController.getUser);

export default authRouter;