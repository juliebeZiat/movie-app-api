import axios from "axios";
import { database } from "../app";
import { GenreType, Movie, MovieDetails, SearchMovie } from "../types/movies";
import { TMBDMovieDetails, TMDBMovie } from "../types/tmdb";
const imageUrl = 'https://image.tmdb.org/t/p/original';

export interface List {
  id: number, 
  user_id?: number,
  moviesIds?: number[]
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
    throw Error('Error while getting popular movies');
  }
};

const getDetails = async (movieId: string): Promise<MovieDetails> => {
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
    throw Error('Error while getting detail movie');
  }
};

const getMovies = async (userId: number): Promise<List> => {
  return new Promise((resolve, reject) => {
    database.all(
      `SELECT user_list.list_id listId, user_list.user_id, lists.movie FROM user_list
      LEFT JOIN lists
      ON lists.list_id = user_list.list_id
      WHERE user_id = ?`,
      [userId],
      function (err, rows) {
        if (err) {
          reject(err);
        }

        const getMovies = rows.map((movies) => movies.movie).filter(movie => movie !== null);
        const getListId = rows.map((listId) => listId.listId)[0];

        resolve({id: getListId, moviesIds: getMovies });
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

const add = async (listId: number, movieId: number) => {
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

const remove = async (listId: number, movieId: number) => {
  return new Promise((resolve, reject) => {
    database.run(
      'DELETE FROM lists WHERE list_id = ? AND movie = ?',
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

const search = async (query: string) => {
  try {
    const results = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
    );

    const transformMovie = (movie: SearchMovie) => {
      return {
        _id: movie.id,
        title: movie.title,
      };
    };
    
    return results.data.results.map(transformMovie);

  } catch (error) {
    throw Error('Error while searching movie');
  }
};

const movieService = {
  getPopular,
  getDetails,
  getMovies,
  createList,
  add,
  remove,
  search
};

export default movieService;