import express from 'express';
import movieController from './movie.controller';

const movieRouter = express.Router();

movieRouter.get('/popular', movieController.getPopular);
movieRouter.get('/:movieId', movieController.getDetails);

export default movieRouter;