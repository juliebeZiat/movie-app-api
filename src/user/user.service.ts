import { database } from '../app';
import { List } from './user.controller';

const isUserHasList = async (token: {id: number}) => {
  return new Promise((resolve, reject) => {
    database.get(
      `SELECT * FROM user_list WHERE userId = ?`,
      [token.id],
      function (err, row) {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
};

const createNewList = async (token: {id: number}) => {
  return new Promise((resolve, reject) => {
    database.run(
      'INSERT INTO user_list (userId) VALUES (?)',
      [token.id],
      function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};

const getList = async (token: {id: number}, movies: number[]): Promise<List> => {
  return new Promise((resolve, reject) => {
    database.each(
      `SELECT * FROM user_list WHERE userId = ?`,
      [token.id],
      function (err, row) {
        if (err) {
          reject(err);
        }
        movies.push(row.movies);
        resolve(row);
      }
    );
  })
};

const userService = {
  isUserHasList,
  createNewList,
  getList,
};

export default userService;
