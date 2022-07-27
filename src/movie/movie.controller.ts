import { Request, Response } from 'express';
import movieService from "./movie.service";

const getPopular = async (req: Request, res: Response) => {
  try {
    const results = await movieService.getPopular();
    return res.send(results);
  } catch (error) {
    console.log(error);
    res.end();
  }
};

const getDetails = async (req: Request, res: Response) => {
  try {
    const results = await movieService.getDetails(req.params.movieId);
    return res.send(results);
  } catch (error) {
    console.log(error);
    res.end();
  }
};

const movieController = {
  getPopular,
  getDetails,
};

export default movieController;