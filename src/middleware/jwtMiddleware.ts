import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import authService from '../auth/auth.service';
import newError, { isError } from '../utils/errors';

const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new newError.InvalidTokenAuthorization('Missing authorization header!');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new newError.InvalidTokenAuthorization('Authentication failed!');
    }
    
    if (!process.env.SECRET_KEY) {
      return;
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY) as { id: number, iat: number };
    
    const user = await authService.findById(decodedToken.id);

    if (!user) {
      throw new newError.UserNotFound(`User with id: ${decodedToken.id} does not exist`);
    }
    
    req.userId = decodedToken.id;
    
    next();
  } catch (err) {
    if (isError(err)) {
      if (err.name === 'userNotFound') {
        res.status(404).send(err.message);
        return;
      }

      if (err.name === 'invalidTokenAuthorization') {
        res.status(401).send(err.message);
        return;
      }
    }
    res.status(500).send(err);
  }
};

export default jwtMiddleware;
