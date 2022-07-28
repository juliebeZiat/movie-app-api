import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validate from '../utils/validation';
import authService from './auth.service';
import newError from '../utils/errors';
import movieService from '../movie/movie.service';

const signIn = async (req: Request, res: Response) => {
  try {    
    const { email, password } = req.body;

    const user = await authService.findByEmail(email);

    if (!user) {
      throw new newError.UserNotFound(`User with email: ${email} does not exist`);
    }

    const comparePassword = bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      throw new newError.InvalidCredentials('Password not valid');
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string);

    res.status(200).send({ user: user, access_token: accessToken });
  } catch (err) {
    if (isError(err)) {
      if (err.name === 'userNotFound') {
        res.status(404).send(err.message);
        return;
      }

      if (err.name === 'invalidCredentials') {
        res.status(400).send(err.message);
        return;
      }
    }
  }
};

const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const isNameValid: boolean = validate.name(name);
    const isEmailValid: boolean = validate.email(email);
    const isPasswordValid: boolean = validate.password(password);

    if (!isNameValid) {
      throw new newError.InvalidCredentials('Name is not valid');
    }

    if (!isEmailValid) {
      throw new newError.InvalidCredentials('Email is not valid');
    }

    if (!isPasswordValid) {
      throw new newError.InvalidCredentials('Password is not valid');
    }

    const user = await authService.findByEmail(email);

    if (user) {
      throw new newError.UserAlreadyExists('User already exists');
    }

    const authUser = await authService.createUser(req.body);

    await movieService.createList(authUser.user.id);

    res.status(201).send(authUser);
  } catch (error) {
    if (isError(error)) {
      if (error.name === 'invalidCredentials') {
        res.status(400).send(error.message);
        return;
      }
    }
    res.status(500).send(error);
  }
};

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

const authController = {
  signIn,
  signUp,
};

export default authController;
