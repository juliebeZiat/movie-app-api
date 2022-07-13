import { Request, Response } from 'express';
import express from 'express';
import axios from 'axios';
import 'dotenv/config';
import cors from 'cors';
import { GenreType, Movie, MovieDetails } from './src/types/movies';
import { TMBDMovieDetails, TMDBMovie } from './src/types/tmdb';

const app = express();
const port = 3000;
const imageUrl = 'https://image.tmdb.org/t/p/original';

const options: cors.CorsOptions = {
  optionsSuccessStatus: 200
};
app.use(cors(options));
app.use(express.json());


app.get('/movie/popular', cors(options), async (req: Request, res: Response) => {
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

app.get('/movie/:movieId', async (req: Request, res: Response) => {
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
