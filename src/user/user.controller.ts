import { Request, Response } from 'express';
import movieService from '../movie/movie.service';
import { MovieDetails } from '../types/movies';
import { decodeToken } from '../utils/decodeToken';
import newError from '../utils/errors';
import userService from './user.service';

export interface List {
  id: number;
  userId: number;
  movies: number[];
}

const getUserList = async (req: Request, res: Response) => {
  const userId = req.user;

  try {
    const user = await userService.isUserHasList(userId.id);

    if (!user) {
      res.status(404).send(`User ${userId.id} has no list`);
    }

    const userList = await userService.getList(userId.id); // userId = id

    res.send({ id: userList.id, userId: userList.userId, movies: userList.movies });
  } catch (error) {
    res.status(500).send(error);
  }
};

// const addMovie = async (req: Request, res: Response) => {
//   const { movieId } = req.body;
//   const movies: number[] = [];
  
//   // check presence of movieId => input validation

//   // retrieve user
//   const userId = decodeToken(token); 

//   // check if id match from TMDB => input validation 
//   const results = await movieService.getPopular();
//   const getIdsPopularMovies = results.map((movie: MovieDetails) => movie._id);
  
//   try {
//     if (!getIdsPopularMovies.includes(movieId)) {
//       throw new newError.ItemNotFound('This item doesn\'t exist');
//     }

//     // const user = await userService.isUserHasList(userId);
    
//     // userService.addItem(userId, movieId) => list

//     //* À AMELIORER
//     if (!user) {
//       await userService.addItem(userId, movieId);
//       const userList = await userService.getList(userId, movies);
//       movies.push(movieId);
//       res.send({ newMovie: movieId, userId: userList.id, movies: movies });
//     } else {
//       const userList = await userService.getList(userId, movies);
//       const newMovie: number = movies.find((e) => e === movieId) as number;
  
//       if (movies.includes(newMovie)) {
//         throw new newError.ItemAlreadyAdded('This item is already added to the list');
//       } else {
//         await userService.addItem(userId, movieId);
//         movies.push(movieId);
//         res.send({ newMovie: movieId, userId: userList.id, movies: movies });
//       }
//     }

//   } catch (err) {
//     if (isError(err)) {
//       if (err.name === 'itemNotFound') {
//         res.status(404).send(err.message);
//         return;
//       }

//       if (err.name === 'itemAlreadyAdded') {
//         res.status(409).send(err.message);
//         return;
//       }
//     }
//   }
// };

// const isError = (error: unknown): error is Error => {
//   return error instanceof Error;
// };

const userController = {
  getUserList,
  // addMovie,
};

export default userController;
