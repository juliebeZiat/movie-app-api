import { Request, Response } from 'express';
import express from 'express';
import axios from 'axios';
import 'dotenv/config';
import cors from 'cors';
import * as sqlite3 from 'sqlite3';
import * as jwt from 'jsonwebtoken';
// import * as bcrypt from 'bcryptjs';

import { GenreType, Movie, MovieDetails } from './src/types/movies';
import { TMBDMovieDetails, TMDBMovie } from './src/types/tmdb';

const app = express();
const port = 3000;
const imageUrl = 'https://image.tmdb.org/t/p/original';

// CORS
const options: cors.CorsOptions = {
  optionsSuccessStatus: 200
};
app.use(cors(options));
app.use(express.json());

// ROUTER
const router = express.Router();
app.use('/', router);

// DB
const database = new sqlite3.Database("./my.db");

router.get('/movie/popular', async (req: Request, res: Response) => {
  try {
    const results = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`
        );
        
        const genreResults = await axios.get(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}`
            );
            
            const genres: GenreType[] = genreResults.data.genres;
            
            const getFullGenreFromId = (id: GenreType['id']): GenreType => {
                const index = genres.findIndex((genre) => genre.id === id);
                
                if (index >= 0) {
                    return genres[index];
                }
                
                throw new Error('Bad genre mapping from TMDB');
    };

    const transformMovie = (movie: TMDBMovie): Movie => {
        return {
            _id: movie.id,
            title: movie.title,
            backdrop_path: imageUrl + movie.backdrop_path,
            poster_path: imageUrl + movie.poster_path,
            genres: movie.genre_ids.map(getFullGenreFromId),
        };
    };
    
    res.send(results.data.results.map(transformMovie));
} catch (error) {
    console.log(error);
    res.end();
}
});

router.get('/movie/:movieId', async (req: Request, res: Response) => {
    try {
        const results = await axios.get(
      `https://api.themoviedb.org/3/movie/${req.params.movieId}?api_key=${process.env.API_KEY}`
      );
      
      const data: TMBDMovieDetails = results.data;
      
      const transformData: MovieDetails = {
          _id: data.id,
          backdrop_path: imageUrl + data.backdrop_path,
          poster_path: imageUrl + data.poster_path,
          title: data.title,
          overview: data.overview,
          release_date: data.release_date,
          vote_average: data.vote_average,
          rating: data.rating,
          genres: data.genres,
        };
        
        res.send(transformData);
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
});

const findUserByEmail = (email: string, cb) => {
    return database.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        //? cb ? row ?
        cb(err, row)
    });
}

router.post('/auth', async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    findUserByEmail(email, (err, user: {id: number, password: string}) => {
        if (err) return res.status(500).send('Server error!');
        if (!user) return res.status(404).send('User not found!');
        if (password !== user.password) return res.status(401).send('Password not valid!');
        const accessToken = jwt.sign({ id: user.id }, password);
        res.status(200).send({ "user": user, "access_token": accessToken });
    });

  } catch (err) {
    console.log(err);
  }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
