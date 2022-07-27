import { Request, Response } from 'express';
import { decodeToken } from '../utils/decodeToken';
import userService from './user.service';

export interface List {
  id: number;
  userId: number;
  movies: number[];
}

const getUserList = async (req: Request, res: Response) => {
  const authHeader: string | undefined = req.headers.authorization;
  if (!authHeader) return null;

  const getTokenDecode = decodeToken(authHeader);

  try {
    const movies: number[] = [];

    const user = await userService.isUserHasList(getTokenDecode);
    
    if (!user) {
      await userService.createNewList(getTokenDecode);
    }

    const userList = await userService.getList(getTokenDecode, movies);
    res.send({ id: userList.id, userId: userList.userId, movies: movies });

  } catch (error) {
    res.status(500).send(error);
  }
};

const userController = {
  getUserList,
};

export default userController;
