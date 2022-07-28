import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error('Missing authorization header!');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new Error('Authentication failed!');
    }

    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY as string);
    //? RESOLVE TS
    
    
    //! VERIF SI USER EXISTE

    req.user = verifiedToken;
    next();
  } catch (err) {
    res.status(400).send('Invalid token !');
  }
};

export default jwtMiddleware;
