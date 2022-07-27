import { Request, Response } from 'express';

const getUserList = async (req: Request, res: Response) => {
  try {
    res.send('Hello');
  } catch (error) {
    console.log(error);
  }
};

const userController = {
  getUserList,
};

export default userController;