import { database } from '../app';
import { IUser } from '../types/user';

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

const create = (user: string[], cb: (err: Error | null) => void) => {
  return database.run(
    'INSERT INTO users (name, email, password) VALUES (?,?,?)',
    user,
    (err) => {
      cb(err);
    }
  );
};

const userService = {
  findByEmail,
  create,
};

export default userService;
