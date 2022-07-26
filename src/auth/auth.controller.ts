import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validate from '../utils/validation';
import userService from '../user/user.service';
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../utils/errors';
import authService from './auth.service';

const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError(`User with email: ${email} does not exist`);
    }

    const comparePassword = bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      throw new InvalidCredentialsError('Password not valid');
    }

    const accessToken = jwt.sign({ id: user.id }, password);
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
      throw new InvalidCredentialsError('Name is not valid');
    }

    if (!isEmailValid) {
      throw new InvalidCredentialsError('Email is not valid');
    }

    if (!isPasswordValid) {
      throw new InvalidCredentialsError('Password is not valid');
    }

    const user = await userService.findByEmail(email);

    if (user) {
      throw new UserAlreadyExistsError('User already exists');
    }

    const authUser = await authService.createUser(req.body);
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
