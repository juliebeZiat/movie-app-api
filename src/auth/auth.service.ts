import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { database } from '../app';
import { IUser } from '../types/user';

const createUser = async (userDto: {
  name: string;
  password: string;
  email: string;
}) => {
  try {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const userId: number = await new Promise((resolve, reject) => {
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

const findByEmail = (email: string): Promise<IUser> => {
  return new Promise((resolve, reject) => {
    database.get(
      `SELECT * FROM users WHERE email = ?`,
      [email],
      function (err, row) {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
};

const authService = {
  createUser,
  findByEmail,
};

export default authService;