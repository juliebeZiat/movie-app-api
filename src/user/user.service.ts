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

const userService = {
  findByEmail,
};

export default userService;