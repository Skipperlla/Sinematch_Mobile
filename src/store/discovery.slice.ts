import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { userAPI } from '@app/api/index';
import type {
  DiscoveriesProps,
  DiscoveryState,
  LikesResponseProps,
  UndoUserProps,
  LikeUserProps,
  RejectUserProps,
  IgnoredResponseProps,
  DeleteDiscoveryParamsProps,
  UndoUserResponseProps,
} from 'types/redux/discovery';

const defaultState: DiscoveryState = {
  Discoveries: [],
  Likes: {
    discoveries: [],
    count: 0,
  } as LikesResponseProps,
  Ignored: {
    discoveries: [],
    count: 0,
  } as IgnoredResponseProps,
  isLoading: true,
  isSwipeDisabled: false,
  statusCode: null,
};

export const allDiscoveries = createAsyncThunk(
  'allDiscoveries',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.get<{ results: DiscoveriesProps[] }>(
        '/discovery/discoveries',
      );
      return data?.results;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const likeUser = createAsyncThunk(
  '/Discovery/Like',
  async (receiverId: string, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.post<{
        results: LikeUserProps;
      }>(`/discovery/like/${receiverId}`);
      return data?.results;
    } catch (err) {
      const { response } = err as APIError;
      const { error, statusCode } = response?.data;

      return rejectWithValue({
        message: error?.message,
        statusCode,
      });
    }
  },
);

export const undoUser = createAsyncThunk(
  '/Discovery/Undo',
  async ({ receiverId, discoveryId }: UndoUserProps, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.put<{ results: UndoUserResponseProps }>(
        `/discovery/undo/${receiverId}/${discoveryId}`,
      );
      return data?.results;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);

export const rejectUser = createAsyncThunk(
  '/Discovery/Reject',
  async (receiverId: string, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.post<{ results: RejectUserProps }>(
        `/discovery/reject/${receiverId}`,
      );
      return data?.results;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const Likes = createAsyncThunk(
  'Likes',
  async (limit: number | undefined, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.get<{
        results: LikesResponseProps;
      }>('/discovery/likes', {
        params: {
          limit,
        },
      });
      return data?.results;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const ignored = createAsyncThunk(
  'ignored',
  async (limit: number | undefined, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.get<{ results: IgnoredResponseProps }>(
        '/discovery/ignored',
        {
          params: {
            limit,
          },
        },
      );
      return data?.results;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const likes = createAsyncThunk(
  'likes',
  async (limit: number, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.get<{
        results: DiscoveriesProps[];
        count: number;
      }>('/discovery/likes', {
        params: {
          limit,
        },
      });

      return data?.results;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const deleteDiscovery = createAsyncThunk(
  'deleteDiscovery',
  async (
    { receiverId, discoveryId }: DeleteDiscoveryParamsProps,
    { rejectWithValue },
  ) => {
    try {
      await userAPI.delete<string>(`/discovery/${receiverId}/${discoveryId}`);

      return discoveryId;
    } catch (err) {
      const { response } = err as APIError;
      const { error } = response?.data;
      return rejectWithValue(error?.message);
    }
  },
);

const discoverySlice = createSlice({
  name: 'discovery',
  initialState: defaultState,
  reducers: {
    resetDiscovery: (state) => {
      state.Discoveries = [];
    },
    resetInitialState: (state) => {
      state.Discoveries = [];
      state.Likes = {
        discoveries: [],
        count: 0,
      };
      state.Ignored = {
        discoveries: [],
        count: 0,
      };
      state.isLoading = true;
      state.statusCode = null;
    },

    setDiscoveries: (state, action: PayloadAction<string>) => {
      state.Discoveries = state?.Discoveries?.filter(
        (user) => user.uuid !== action.payload,
      );
    },
    setLikes: (state, action: PayloadAction<string>) => {
      state.Likes.discoveries = state.Likes?.discoveries?.filter(
        (item) =>
          item?.uuid !== action.payload &&
          item?.sender?.uuid !== action.payload,
      );
      state.Likes.count = state.Likes?.count && state.Likes?.count - 1;
    },
    setIgnored: (state, action: PayloadAction<string>) => {
      state.Ignored.discoveries = state.Ignored?.discoveries?.filter(
        (item) =>
          item.user.uuid !== action.payload && item.uuid !== action.payload,
      );
      state.Ignored.count = state.Ignored.count && state.Ignored.count - 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(allDiscoveries.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      allDiscoveries.fulfilled,
      (state, action: PayloadAction<DiscoveriesProps[]>) => {
        state.Discoveries = action.payload;
        state.isLoading = false;
      },
    );
    builder.addCase(allDiscoveries.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(Likes.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      Likes.fulfilled,
      (state, action: PayloadAction<LikesResponseProps>) => {
        state.isLoading = false;
        state.Likes = action.payload;
      },
    );
    builder.addCase(Likes.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(ignored.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      ignored.fulfilled,
      (state, action: PayloadAction<IgnoredResponseProps>) => {
        state.isLoading = false;
        state.Ignored = action.payload;
      },
    );
    builder.addCase(ignored.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(likeUser.pending, (state) => {
      state.isSwipeDisabled = true;
    });
    builder.addCase(
      likeUser.fulfilled,
      (state, action: PayloadAction<LikeUserProps>) => {
        state.Likes.discoveries = state.Likes?.discoveries?.filter((item) => {
          return item.uuid !== action.payload.discoveryId;
        });
        state.Likes.count = state.Likes?.count && state.Likes?.count - 1;
        state.isSwipeDisabled = false;
      },
    );
    builder.addCase(likeUser.rejected, (state) => {
      state.isSwipeDisabled = false;
    });

    builder.addCase(rejectUser.pending, (state) => {
      state.isSwipeDisabled = true;
    });
    builder.addCase(
      rejectUser.fulfilled,
      (state, action: PayloadAction<RejectUserProps>) => {
        state.Likes.discoveries = state.Likes?.discoveries?.filter((item) => {
          return item.uuid !== action.payload.discoveryId;
        });
        state.Likes.count = state.Likes?.count && state.Likes?.count - 1;
        state.isSwipeDisabled = false;
      },
    );
    builder.addCase(rejectUser.rejected, (state) => {
      state.isSwipeDisabled = false;
    });

    builder.addCase(
      deleteDiscovery.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.Ignored.discoveries = state.Ignored?.discoveries?.filter(
          (item) => {
            return item.uuid !== action.payload;
          },
        );
        state.Ignored.count = state.Ignored?.count && state.Ignored?.count - 1;
      },
    );
    builder.addCase(
      undoUser.fulfilled,
      (state, action: PayloadAction<UndoUserResponseProps>) => {
        state.Ignored.discoveries = state.Ignored?.discoveries?.filter(
          (item) => {
            return item.uuid !== action.payload.discoveryId;
          },
        );
        state.Ignored.count = state.Ignored?.count && state.Ignored?.count - 1;
      },
    );
  },
});

export default discoverySlice.reducer;
export const {
  resetDiscovery,
  setDiscoveries,
  setIgnored,
  setLikes,
  resetInitialState,
} = discoverySlice.actions;
