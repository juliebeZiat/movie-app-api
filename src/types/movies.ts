export type GenreType = {
  id: number;
  name: string;
};

export type Movie = {
  _id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  genres: GenreType[];
};

export type MovieDetails = {
  _id: number;
  backdrop_path: string;
  poster_path: string;
  genres: GenreType[];
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  rating: number;
};