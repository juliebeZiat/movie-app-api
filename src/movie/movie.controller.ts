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
  const userId = req.user;

  if (!userId) {
    throw new Error();
  }
  
  try {
    const list = await movieService.getList(userId);
    res.send({ userId: userId, list });

  } catch (error) {
    res.status(500).send(error);
    res.end();
  }
};

const add = async (req: Request, res: Response) => {
  const userId = req.user;

  if (!userId) {
    throw new Error();
  }

  const { movieId } = req.body;

  try {
    const list = await movieService.getList(userId);

    if (!list.movies) {
      return;
    }

    if (list.movies.includes(movieId)) {
      throw new newError.ItemAlreadyAdded('This item is already added to the list');
    };

    const isMovieExists = await movieService.getDetails(movieId);

    if (isMovieExists.code === 'ERR_BAD_REQUEST') {
      res.status(404).send('This movie doesn\'t exist');
    }
 
    await movieService.add(list.id, movieId);

    res.send({ newMovie: movieId, title: isMovieExists.title });

  } catch (err) {
    if (newError.isError(err)) {
      if (err.name === 'itemAlreadyAdded') {
        res.status(409).send(err.message);
        return;
      }
    }
  }
};

const remove = async (req: Request, res: Response) => {
  const userId = req.user;

  if (!userId) {
    throw new Error();
  }

  const { movieId } = req.body;

  try {
    const list = await movieService.getList(userId);

    if (!list.movies) {
      return;
    }

    if (!list.movies.includes(movieId)) {
      throw new newError.ItemNotFound('This item is not in the list');
    };

    await movieService.remove(list.id, movieId);

    res.send({ removedMovie: movieId });

  } catch (err) {
    if (newError.isError(err)) {
      if (err.name === 'itemNotFound') {
        res.status(404).send(err.message);
        return;
      }
    }
  }
};

const movieController = {
  getPopular,
  getDetails,
  getList,
  add,
  remove,
};

export default movieController;
