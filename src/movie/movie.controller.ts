import { Request, Response } from 'express';
import newError, { isError } from '../utils/errors';
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

const getMovies = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    throw new newError.UserNotFound('User id not found');
  }

  
  
  try {
    const list = await movieService.getMovies(userId);

    if (list.moviesIds === [] || !list.moviesIds) {
      return;
    }

    const detailedMovies = await Promise.all(list.moviesIds.map((movieId) => {
      const result = movieService.getDetails(movieId.toString());
      return result;
    }));
    
    res.send({ list, detailedMovies });

  } catch (err) {
    if (isError(err)) {
      if (err.name === 'userNotFound') {
        res.status(404).send(err.message);
        return;
      }
    }
    res.status(500).send(err);
    res.end();
  }
};

const add = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    throw new newError.UserNotFound('User id not found');
  }

  const { movieId } = req.body;

  try {
    const list = await movieService.getMovies(userId);

    const moviesIds = list.moviesIds?.map((movie) => movie);
    
    if (!moviesIds) {
      return;
    }

    if (moviesIds.includes(movieId)) {
      throw new newError.ItemAlreadyAdded('This item is already added to the list');
    };

    const isMovieExists = await movieService.getDetails(movieId);

    if (isMovieExists.code === 'ERR_BAD_REQUEST') {
      res.status(404).send('This movie doesn\'t exist');
    }
 
    await movieService.add(list.id, movieId);

    res.send({ newMovie: movieId, title: isMovieExists.title });

  } catch (err) {
    if (isError(err)) {
      if (err.name === 'itemAlreadyAdded') {
        res.status(409).send(err.message);
        return;
      }
      if (err.name === 'userNotFound') {
        res.status(404).send(err.message);
        return;
      }
    }
  }
};

const remove = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    throw new newError.UserNotFound('User id not found');
  }

  const { movieId } = req.body;

  try {
    const list = await movieService.getMovies(userId);

    const moviesIds = list.moviesIds?.map((movie) => movie);
    
    if (!moviesIds) {
      return;
    }

    if (!moviesIds.includes(movieId)) {
      throw new newError.ItemNotFound('This item is not in the list');
    };

    await movieService.remove(list.id, movieId);

    res.status(204).send({ removedMovie: movieId });

  } catch (err) {
    if (isError(err)) {
      if (err.name === 'itemNotFound') {
        res.status(404).send(err.message);
        return;
      }
      if (err.name === 'userNotFound') {
        res.status(404).send(err.message);
        return;
      }
    }
  }
};

const movieController = {
  getPopular,
  getDetails,
  getMovies,
  add,
  remove,
};

export default movieController;
