import { Request, Response } from 'express';
import newError from '../utils/errors';
import movieService from './movie.service';

const getPopular = async (req: Request, res: Response) => {
  try {
    const results = await movieService.getPopular();
    return res.send(results);
  } catch (error) {
    res.status(500).send(error);
    res.end();
  }
};

const getDetails = async (req: Request, res: Response) => {
  try {
    const results = await movieService.getDetails(req.params.movieId);
    return res.send(results);
  } catch (error) {
    res.status(500).send(error);
    res.end();
  }
};

const getList = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error();
  }
  
  try {
    const list = await movieService.getList(userId);

    const getMovies = await movieService.getMovies(list.list_id);
    
    res.send({ user_id: userId, list_id: list.list_id, movies: getMovies ? getMovies : [] });

  } catch (error) {
    res.status(500).send(error);
    res.end();
  }
};

const addItem = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error();
  }

  const { movieId } = req.body;

  try {
    const getListOfCurrentUser = await movieService.getList(userId);

    const getMoviesOfCurrentUser = await movieService.getMovies(getListOfCurrentUser.list_id);
    const getIds = getMoviesOfCurrentUser.map((movie) => movie.movie);

    if (getIds.includes(movieId)) {
      throw new newError.ItemAlreadyAdded('This item is already added to the list');
    };
    
    await movieService.addMovie(getListOfCurrentUser.list_id, movieId);

    res.send({ newMovie: movieId });

  } catch (err) {
    if (isError(err)) {
      if (err.name === 'itemNotFound') {
        res.status(404).send(err.message);
        return;
      }

      if (err.name === 'itemAlreadyAdded') {
        res.status(409).send(err.message);
        return;
      }
    }
  }
};

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

const movieController = {
  getPopular,
  getDetails,
  getList,
  addItem,
};

export default movieController;
