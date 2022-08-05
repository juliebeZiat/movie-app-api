import express from 'express';
import jwtMiddleware from '../middleware/jwtMiddleware';
import movieController from './movie.controller';

const movieRouter = express.Router();

movieRouter.get('/list', jwtMiddleware, movieController.getMovies);
movieRouter.put('/list', jwtMiddleware, movieController.add);
movieRouter.delete('/list', jwtMiddleware, movieController.remove);
movieRouter.get('/popular', movieController.getPopular);
movieRouter.get('/search', movieController.search);
movieRouter.get('/:movieId', movieController.getDetails);

export default movieRouter;