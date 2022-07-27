import { Request, Response } from 'express';
import movieController from '../movie/movie.controller';
import movieService from '../movie/movie.service';
import { MovieDetails } from '../types/movies';
import { decodeToken } from '../utils/decodeToken';
import userService from './user.service';

export interface List {
  id: number;
  userId: number;
  movies: number[];
}

const getUserList = async (req: Request, res: Response) => {
  const token: string | undefined = req.headers.authorization;
  if (!token) return null;

  const userId = decodeToken(token);

  try {
    const movies: number[] = [];
    const user = await userService.isUserHasList(userId);

    if (!user) {
      res.status(404).send(`User ${userId.id} has no list`);
    }

    const userList = await userService.getList(userId, movies);
    res.send({ id: userList.id, userId: userList.userId, movies: movies });
  } catch (error) {
    res.status(500).send(error);
  }
};

const addMovie = async (req: Request, res: Response) => {
  const { movieId } = req.body;
  const movies: number[] = [];
  const token: string | undefined = req.headers.authorization;
  if (!token) return null;
  
  const userId = decodeToken(token);

  const results = await movieService.getPopular();
  const getIdsPopularMovies = results.map((movie: MovieDetails) => movie._id)
  console.log(getIdsPopularMovies);
  
  try {
    if (!getIdsPopularMovies.includes(movieId)) {
      throw new Error();
    }
    
    const user = await userService.isUserHasList(userId);
    
    //* À AMELIORER
    if (!user) {
      await userService.addItem(userId, movieId);
      const userList = await userService.getList(userId, movies);
      movies.push(movieId);
      res.send({ newMovie: movieId, userId: userList.id, movies: movies });
    } else {
      const userList = await userService.getList(userId, movies);
      const newMovie: number = movies.find((e) => e === movieId) as number;
  
      if (movies.includes(newMovie)) {
        throw new Error();
      } else {
        await userService.addItem(userId, movieId);
        movies.push(movieId);
        res.send({ newMovie: movieId, userId: userList.id, movies: movies });
      }
    }

  } catch (error) {
    res.status(500).send(error);
  }
};

const userController = {
  getUserList,
  addMovie,
};

export default userController;
