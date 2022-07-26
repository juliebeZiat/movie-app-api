import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { database } from '../app';

const createUser = async (userDto: {
  name: string;
  password: string;
  email: string;
}) => {
  try {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const userId = await new Promise((resolve, reject) => {
      database.run(
        'INSERT INTO users (name, email, password) VALUES (?,?,?)',
        [userDto.name, userDto.email, hashedPassword],
        function (err) {
          if (err) {
            reject(err);
          }
          resolve (this.lastID);
        }
      );
    });
    const accessToken = jwt.sign({ id: userId }, process.env.SECRET_KEY as string);
    return {
      user: { name: userDto.name, email: userDto.email, id: userId },
      accessToken,
    };

  } catch (error) {
    console.error('from authService createUser: ', error);

    throw error;
  }
};

const authService = {
  createUser,
};

export default authService;