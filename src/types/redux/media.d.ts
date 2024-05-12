export type NameProps = {
  tr: string;
  en: string;
};

type GenreProps = {
  _id: string;
  name: string;
  id: string;
  mediaType: string;
  registeredUsers: string[];
};
type MediaProps = {
  posterPath: string;
  id: number;
  genreIds: number[];
  title: string;
  mediaType: string;
  vote?: number;
};
type MultiSearchResponseProps = {
  page: number;
  results: MediaProps[];
  total_pages: number;
  total_results: number;
};
type MediaState = {
  Genres: GenreProps[];
  MultiSearch: MultiSearchResponseProps;
  PopularMedias: MediaProps[];
  SelectedFavorites: MediaProps[];
  ExcludedFavorites: MediaProps[];
  isLoading: boolean;
  statusCode: number | null;
  isSearching: boolean;
};
export type FavoriteResponseProps = {
  favMovies: MediaProps[];
  favSeries: MediaProps[];
};
