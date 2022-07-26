import { database } from '../app';
import { IUser } from '../types/user';

const findByEmail = (email: string): Promise<IUser | undefined> => {
  return new Promise((resolve, reject) => {
    database.get(
      `SELECT * FROM users WHERE email = ?`,
      [email],
      function (err, row) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

const userService = {
  findByEmail,
};

export default userService;
