import { database } from '../app';
import { IUser } from '../types/user';

const findByEmail = (
  email: string,
  cb: (err: TypeError | null, row: IUser) => void
) => {
  return database.get(
    `SELECT * FROM users WHERE email = ?`,
    [email],
    function (err, row) {
      cb(err, row);
    }
  );
};

const create = (user: string[], cb: (err: Error | null) => void) => {
  return database.run('INSERT INTO users (name, email, password) VALUES (?,?,?)', user, (err) => {
      cb(err)
  });
};

const userService = {
  findByEmail,
  create,
};

export default userService;