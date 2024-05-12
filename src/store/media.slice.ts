import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { mediaAPI } from '@app/api';
import type {
  GenreProps,
  MultiSearchResponseProps,
  MediaProps,
  MediaState,
} from 'types/redux/media';
import type { FilterProps } from '@app/screens/SignUp/Favorite/Index';

const initialState: MediaState = {
  Genres: [],
  MultiSearch: {} as MultiSearchResponseProps,
  PopularMedias: [],
  SelectedFavorites: [],
  ExcludedFavorites: [],
  isLoading: false,
  statusCode: null,
  isSearching: false,
};

export const Genres = createAsyncThunk(
  '/Genres',
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { results },
      } = await mediaAPI.get<{ results: GenreProps[] }>('/search/genres');
      return results;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const popularMedias = createAsyncThunk(
  'popularMedias',
  async (mediaType: string | undefined, { rejectWithValue }) => {
    try {
      const { data } = await mediaAPI.get<{ results: MediaProps[] }>(
        '/search/popular',
        {
          params: { mediaType },
        },
      );
      return data?.results;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const multiSearch = createAsyncThunk(
  'multiSearch',
  async (query: FilterProps, { rejectWithValue }) => {
    try {
      const { data } = await mediaAPI.get<MultiSearchResponseProps>(
        '/search/multi',
        {
          params: query,
        },
      );
      return data;
    } catch {
      return rejectWithValue(null);
    }
  },
);

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setFavorite: (state, action: PayloadAction<MediaProps>) => {
      const { id } = action.payload;
      const checkFavorite = state.SelectedFavorites.some(
        (favorite) => favorite.id === id,
      );

      if (checkFavorite) {
        state.ExcludedFavorites.push(action.payload);
        state.SelectedFavorites = state?.SelectedFavorites?.filter(
          (selected) => selected.id !== id,
        );
      } else {
        state.SelectedFavorites.push(action.payload);
        state.ExcludedFavorites = state?.ExcludedFavorites?.filter(
          (excluded) => excluded.id !== id,
        );
      }
    },
    multipleSetFavorite: (state, action: PayloadAction<MediaProps[]>) => {
      state.SelectedFavorites = action.payload;
    },
    setResetState: (state) => {
      state.MultiSearch = {} as MultiSearchResponseProps;
      state.PopularMedias = [];
      state.SelectedFavorites = [];
      state.ExcludedFavorites = [];
      state.Genres = [];
    },

    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setSelectedFavorites: (state, action: PayloadAction<MediaProps[]>) => {
      state.SelectedFavorites = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(Genres.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      Genres.fulfilled,
      (state, action: PayloadAction<GenreProps[]>) => {
        state.isLoading = false;
        state.Genres = action.payload;
      },
    );
    builder.addCase(Genres.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(popularMedias.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
      state.MultiSearch = {} as MultiSearchResponseProps;
    });
    builder.addCase(
      popularMedias.fulfilled,
      (state, action: PayloadAction<MediaProps[]>) => {
        state.isLoading = false;
        state.isSearching = false;
        state.PopularMedias = action.payload;
      },
    );
    builder.addCase(popularMedias.rejected, (state) => {
      state.isSearching = false;
    });

    builder.addCase(multiSearch.pending, (state) => {
      state.statusCode = null;
      state.isLoading = true;
    });
    builder.addCase(
      multiSearch.fulfilled,
      (state, action: PayloadAction<MultiSearchResponseProps>) => {
        state.isLoading = false;
        state.MultiSearch =
          action.payload.page > 1
            ? {
                ...state.MultiSearch,
                results: [
                  ...state.MultiSearch.results,
                  ...action.payload.results,
                ],
              }
            : action.payload;
        state.isSearching = false;
      },
    );
    builder.addCase(multiSearch.rejected, (state) => {
      state.isSearching = false;
    });
  },
});

export default mediaSlice.reducer;
export const {
  setFavorite,
  setResetState,
  setIsSearching,
  setSelectedFavorites,
  multipleSetFavorite,
} = mediaSlice.actions;
