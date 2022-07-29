import express from 'express';
import jwtMiddleware from '../middleware/jwtMiddleware';
import movieController from './movie.controller';

const movieRouter = express.Router();

movieRouter.get('/popular', movieController.getPopular);
movieRouter.get('/list', jwtMiddleware, movieController.getList);
movieRouter.put('/list', jwtMiddleware, movieController.add);
movieRouter.delete('/list', jwtMiddleware, movieController.remove);
movieRouter.get('/:movieId', movieController.getDetails);

export default movieRouter;