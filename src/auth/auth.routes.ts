import express from 'express';
import authController from './auth.controller';

const authRouter = express.Router();

authRouter.post('/signin', authController.signIn);
authRouter.post('/signup', authController.signUp);

export default authRouter;