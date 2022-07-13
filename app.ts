import { Request, Response } from 'express';
import express from 'express';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const port = 3000;

app.get('/movie/popular', async (req: Request, res: Response) => {
    try {
        const result = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`
        );
        res.send(result.data.results);
    } catch (error) {
        console.log(error);
        res.end();
    }
});

app.get('/movie/:movieId', async (req: Request, res: Response) => {
    try {
        const result = await axios.get(
            `https://api.themoviedb.org/3/movie/${req.params.movieId}?api_key=${process.env.API_KEY}`
        );
        res.send(result.data);
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
