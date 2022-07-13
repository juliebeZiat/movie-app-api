import { GenreType } from "./movies";

export type TMDBMovie = {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  genre_ids: number[];
};

export type TMBDMovieDetails = {
  id: number;
  backdrop_path: string;
  poster_path: string;
  genres: GenreType[];
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  rating: number;
};