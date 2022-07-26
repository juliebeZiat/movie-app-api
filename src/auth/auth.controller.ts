import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validate from '../utils/validation';
import userService from '../user/user.service';
import { IUser } from '../types/user';
import { InvalidCredentialsError } from '../utils/errors';

const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const findUser = userService.findByEmail(email, (err, user: IUser) => {
      if (!user) {
        res.status(404).send('User not found!');
        return;
      }

      const comparePassword = bcrypt.compareSync(password, user.password);

      if (!comparePassword) {
        res.status(401).send('Password not valid!');
        return;
      }

      const accessToken = jwt.sign({ id: user.id }, password);
      res.status(200).send({ user: user, access_token: accessToken });
    });

    if (!findUser) {
      res.status(500).send('Server error!');
      return;
    }
  } catch (err) {
    console.log(err);
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

    userService.create([name, email, password], (err) => {
      if (err) {
        if (err.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email') {
          res.status(403).send("User already exists");
          return;
        }
        res.status(500).send(err);
        return;
      }

      userService.findByEmail(email, (err, user) => {
        if (err) {
          res.status(500).send("Server error!");
          return;
        }
        const accessToken = jwt.sign({id: user.id}, process.env.SECRET_KEY as string);
        res.status(200).send({"user": user, "access_token": accessToken});
      })
    });

  } catch (error) {
    console.log(error);
    
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
