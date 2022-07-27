import axios from "axios";
import { GenreType, Movie, MovieDetails } from "../types/movies";
import { TMBDMovieDetails, TMDBMovie } from "../types/tmdb";
const imageUrl = 'https://image.tmdb.org/t/p/original';

const getPopular = async () => {
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
    return results.data.results.map(transformMovie);
  } catch (error) {
    console.log(error);
  }
};

const getDetails = async (movieId: string) => {
  try {
    const results = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}`
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
    return transformData;
  } catch (error) {
    console.log(error);
  }
}

const movieService = {
  getPopular,
  getDetails,
};

export default movieService;