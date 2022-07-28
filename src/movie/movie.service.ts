import axios from "axios";
import { database } from "../app";
import { GenreType, Movie, MovieDetails } from "../types/movies";
import { TMBDMovieDetails, TMDBMovie } from "../types/tmdb";
const imageUrl = 'https://image.tmdb.org/t/p/original';

export interface List {
  list_id: number, 
  user_id: number
}

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
};

const getList = async (userId: number): Promise<List> => {
  return new Promise((resolve, reject) => {
    database.get(
      'SELECT * FROM user_list WHERE user_id = ?',
      [userId],
      function (err, row) {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
};


const createList = async (userId: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    database.run(
      'INSERT INTO user_list (user_id) VALUES (?)',
      [userId],
      function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};

const addMovie = async (listId: number, movieId: number) => {
  return new Promise((resolve, reject) => {
    database.run(
      'INSERT INTO lists (list_id, movie) VALUES (?,?)',
      [listId, movieId],
      function (err) {
        if (err) {
          reject(err);
        }
        resolve(movieId);
      }
    );
  });
};

const getMovies = async (listId: number): Promise<{movie: number}[]> => {
  return new Promise((resolve, reject) => {
    database.all(
      'SELECT movie FROM lists WHERE list_id = ?',
      [listId],
      function (err, row) {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
};


const movieService = {
  getPopular,
  getDetails,
  getList,
  createList,
  addMovie,
  getMovies,
};

export default movieService;