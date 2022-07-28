import { Request, Response } from 'express';
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
    
    res.send({ user_id: userId, list_id: list.list_id, movies: getMovies });

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

    await movieService.addMovie(getListOfCurrentUser.list_id, movieId);

    res.send({ newMovie: movieId });

  } catch (error) {
    res.status(500).send(error);
    res.end();
  }
};

const movieController = {
  getPopular,
  getDetails,
  getList,
  addItem,
};

export default movieController;
