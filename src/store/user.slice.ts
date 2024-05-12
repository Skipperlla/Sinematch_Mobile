import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { userAPI } from '@app/api';
import {
  GenreProps,
  MediaProps,
  FavoriteResponseProps,
} from '@app/types/redux/media';
import {
  DeleteAvatarProps,
  DiscoverySettingsProps,
  FormDataProps,
  ImageProps,
  UserProps,
  NotificationProps,
  MyProfileMediaProps,
  InfoProps,
} from '@app/types/redux/user';
import {
  LoginResponseProps,
  ProviderProps,
  RegisterProps,
} from '@app/types/redux/auth';
import { StorageKeys } from '@app/constants';

type UserState = {
  User: UserProps;
  Blocked: UserProps[];
  Images: ImageProps[];
  MyProfile: MyProfileMediaProps;
  isLoading: boolean;
  statusCode: number | null;
  isLoggedIn: boolean;
};

const defaultImageState = Array.from(Array(6), (_, index) => {
  return {
    Location: '',
    ETag: '',
    Bucket: '',
    key: Math.floor(Math.random() * 1000000).toString(),
    index: index + 1,
    imageType: '',
  };
});
const initialState: UserState = {
  User: {} as UserProps,
  Blocked: [],
  Images: defaultImageState,
  MyProfile: {} as MyProfileMediaProps,
  isLoading: false,
  statusCode: null,
  isLoggedIn: false,
};

export const loginWithProvider = createAsyncThunk(
  '/loginWithProvider',
  async (
    { provider, providerId, email, fullName, uuid }: ProviderProps,
    { rejectWithValue },
  ) => {
    try {
      const {
        data: { results, statusCode },
      } = await userAPI.post<LoginResponseProps>('/auth/loginWithProvider', {
        provider,
        providerId,
        email,
        fullName,
        uuid,
      });

      await AsyncStorage.setItem(StorageKeys.accessToken, results?.accessToken);
      return {
        user: results?.user,
        statusCode,
        accessToken: results?.accessToken,
      };
    } catch (err) {
      return rejectWithValue(null);
    }
  },
);
export const Register = createAsyncThunk(
  'register',
  async (form: RegisterProps, { rejectWithValue }) => {
    try {
      const {
        data: { results },
      } = await userAPI.put<{ results: UserProps }>('/auth/register', form);
      return results;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);

export const Logout = createAsyncThunk(
  'Logout',
  async (_, { rejectWithValue }) => {
    try {
      await userAPI.get('/auth/logout');
      await AsyncStorage.clear();
    } catch {
      await AsyncStorage.clear();
      return rejectWithValue(null);
    }
  },
);
export const deleteAccount = createAsyncThunk(
  'deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      await userAPI.delete('/deleteAccount');
      await AsyncStorage.clear();
    } catch (err) {
      const { response } = err as APIError;
      await AsyncStorage.clear();
      return rejectWithValue(response.data.error.message);
    }
  },
);

export const isLoggedIn = createAsyncThunk(
  '/isLoggedIn',
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { results },
      } = await userAPI.get<{
        results: UserProps;
      }>('/isLoggedIn');
      return results;
    } catch (err) {
      const { response } = err as APIError;
      await AsyncStorage.clear();
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);

export const discoverySettings = createAsyncThunk(
  '/discoverySettings',
  async (settings: DiscoverySettingsProps, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.put<{ results: DiscoverySettingsProps }>(
        '/profile/discoverySettings',
        settings,
      );
      return data?.results;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);

export const addGenre = createAsyncThunk(
  '/addGenre',
  async (genres: (string | GenreProps)[], { rejectWithValue }) => {
    try {
      const { data } = await userAPI.put<{
        results: string[] | GenreProps[];
      }>('/favorites/addGenre', {
        genres,
      });
      return data?.results;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);
export const removeGenre = createAsyncThunk(
  '/deleteGenre',
  async (genres: string[], { rejectWithValue }) => {
    try {
      const { data } = await userAPI.delete<{
        results: string[] | GenreProps[];
      }>('/favorites/deleteGenre', {
        data: {
          genres,
        },
      });
      return data?.results;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);
export const addFavorite = createAsyncThunk(
  '/addFav',
  async (favorites: MediaProps[], { rejectWithValue }) => {
    try {
      const { data } = await userAPI.put<{ results: FavoriteResponseProps }>(
        '/favorites/addFav',
        {
          favorites,
        },
      );
      return data?.results;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response.data.error.message);
    }
  },
);
export const removeFavorite = createAsyncThunk(
  '/removeFav',
  async (favorites: MediaProps[], { rejectWithValue }) => {
    try {
      const { data } = await userAPI.delete<{ results: FavoriteResponseProps }>(
        '/favorites/removeFav',
        {
          data: { favorites },
        },
      );
      return data?.results;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response.data.error.message);
    }
  },
);
export const uploadProfilePhoto = createAsyncThunk(
  '/Avatar/uploadProfilePhoto',
  async (formData: FormDataProps, { rejectWithValue }) => {
    const form = new FormData();
    form.append('avatar', formData);
    try {
      const {
        data: { results, message },
      } = await userAPI.put<{
        results: ImageProps;
        message: string;
      }>('/avatar/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: results, message };
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);
export const changePrimaryAvatar = createAsyncThunk(
  '/Avatar/changePrimaryAvatar',
  async (formData: FormDataProps, { rejectWithValue }) => {
    const form = new FormData();
    form.append('avatar', formData);
    try {
      const {
        data: { results },
      } = await userAPI.put<{ results: ImageProps }>(
        '/avatar/changePrimary',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return results;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);

export const deleteAvatar = createAsyncThunk(
  '/Avatar/deleteAvatar',
  async (data: DeleteAvatarProps, { rejectWithValue }) => {
    try {
      await userAPI.delete<string>('/avatar/delete', {
        data: data,
      });
      return data?.key;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);
export const changeAvatarSequence = createAsyncThunk(
  'changeAvatarSequence',
  async (avatars: ImageProps[], { rejectWithValue }) => {
    const reIndex = avatars.map((avatar, index) => {
      return { ...avatar, index: index + 1 };
    });
    try {
      await userAPI.put<ImageProps[]>('/avatar/sequenceChange', {
        avatars: reIndex,
      });
      return reIndex;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);
export const setLocation = createAsyncThunk(
  'setLocation',
  async (
    location: {
      latitude: number;
      longitude: number;
    },
    { rejectWithValue },
  ) => {
    try {
      await userAPI.post<{
        results: {
          matchedPercent: number;
        };
      }>('/profile/location', location);
    } catch {
      return rejectWithValue(null);
    }
  },
);
export const updateProfile = createAsyncThunk(
  'updateProfile',
  async (data: UserProps, { rejectWithValue }) => {
    try {
      const {
        data: { results },
      } = await userAPI.put<{
        results: UserProps;
      }>('/profile/update', data);
      return results;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);
export const updateInfo = createAsyncThunk(
  'updateInfo',
  async (data: InfoProps, { rejectWithValue }) => {
    try {
      const {
        data: { results },
      } = await userAPI.put<{
        results: InfoProps;
      }>('/profile/updateInfo', data);
      return results;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);
export const getUserPercentForMatch = createAsyncThunk(
  'getUserPercentForMatch',
  async (userId: string, { rejectWithValue }) => {
    try {
      const {
        data: { results },
      } = await userAPI.get<{
        results: {
          matchPercent: number;
        };
      }>(`/matchPercent/${userId}`);
      return results?.matchPercent;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);

export const blockUser = createAsyncThunk(
  'blockUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.post<{
        results: {
          userId: string;
        };
      }>('/block', { userId });
      return data?.results?.userId;
    } catch {
      return rejectWithValue(null);
    }
  },
);
export const unBlockUser = createAsyncThunk(
  'unBlockUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await userAPI.post('/unblock', { userId });
      return userId;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const updateNotification = createAsyncThunk(
  'updateNotification',
  async (data: NotificationProps, { rejectWithValue }) => {
    try {
      const {
        data: { results },
      } = await userAPI.put<{
        results: NotificationProps;
      }>('/profile/notification', data);
      return results;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);
export const getBlockUsers = createAsyncThunk(
  'getBlockUsers',
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { results },
      } = await userAPI.get<{
        results: UserProps[];
      }>('/blockUsers');
      return results;
    } catch {
      return rejectWithValue(null);
    }
  },
);
export const myProfileMedia = createAsyncThunk(
  'myProfileMedia',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.get<{
        results: MyProfileMediaProps;
      }>(`favorites/list/${userId}`);
      return data?.results ?? null;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<UserProps>) => {
      state.User = {
        ...state.User,
        ...action.payload,
      };
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setPicture: (state, action: PayloadAction<ImageProps[]>) => {
      state.Images = state.Images.map((image, index) => {
        if (image.index === action?.payload?.[index]?.index) {
          return {
            ...image,
            ...action.payload[index],
          };
        }
        return image;
      });
      //TODO: Burasi belki kaldirilabilir
      state.User.avatars = action.payload;
    },
    setResetInitialState: (state) => {
      state.User = {} as UserProps;
      state.Images = defaultImageState;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(isLoggedIn.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      isLoggedIn.fulfilled,
      (state, action: PayloadAction<UserProps>) => {
        // TODO: Gelicek statuCode'a gore aksiyonlar degisicek
        state.isLoading = false;
        state.User = action.payload;
        state.Images = state.Images.map((image, index) => {
          if (image.index === action?.payload?.avatars?.[index]?.index) {
            return {
              ...image,
              ...action.payload.avatars[index],
            };
          }
          return image;
        });
        state.isLoggedIn = true;
      },
    );
    builder.addCase(isLoggedIn.rejected, (state) => {
      state.isLoading = false;
      state.User = {} as UserProps;
      state.Images = defaultImageState;
      state.isLoggedIn = false;
    });

    builder.addCase(discoverySettings.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      discoverySettings.fulfilled,
      (state, action: PayloadAction<DiscoverySettingsProps>) => {
        state.isLoading = false;
        state.User.discoverySettings = action.payload;
      },
    );
    builder.addCase(discoverySettings.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(addGenre.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      addGenre.fulfilled,
      (state, action: PayloadAction<(string | GenreProps)[]>) => {
        state.isLoading = false;
        state.User.genres = action.payload;
      },
    );
    builder.addCase(addGenre.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(removeGenre.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      removeGenre.fulfilled,
      (state, action: PayloadAction<(string | GenreProps)[]>) => {
        state.isLoading = false;
        state.User.genres = action.payload;
      },
    );
    builder.addCase(removeGenre.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addFavorite.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      addFavorite.fulfilled,
      (state, action: PayloadAction<FavoriteResponseProps>) => {
        state.isLoading = false;
        state.User.favMovies = action.payload.favMovies;
        state.User.favSeries = action.payload.favSeries;
      },
    );
    builder.addCase(addFavorite.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(removeFavorite.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      removeFavorite.fulfilled,
      (state, action: PayloadAction<FavoriteResponseProps>) => {
        state.isLoading = false;
        state.User.favMovies = action.payload.favMovies;
        state.User.favSeries = action.payload.favSeries;
      },
    );
    builder.addCase(removeFavorite.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(uploadProfilePhoto.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      uploadProfilePhoto.fulfilled,
      (state, action: PayloadAction<{ data: ImageProps }>) => {
        state.isLoading = false;
        state.Images = state.Images.map((image, index) => {
          if (action.payload.data.index === index + 1)
            return { ...image, ...action.payload.data };
          return image;
        });
        if (state.User?.avatars?.length)
          state.User?.avatars?.push(action.payload.data);
        else state.User.avatars = [action.payload.data];
      },
    );
    builder.addCase(uploadProfilePhoto.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(changePrimaryAvatar.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      changePrimaryAvatar.fulfilled,
      (state, action: PayloadAction<ImageProps>) => {
        state.isLoading = false;
        state.Images[0] = action.payload;
        if (state.User?.avatars?.length) state.User.avatars[0] = action.payload;
      },
    );
    builder.addCase(changePrimaryAvatar.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(deleteAvatar.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      deleteAvatar.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.Images = state.Images.filter(
          (image) => image.key !== action.payload,
        ).map((image, index) => {
          return {
            ...image,
            index: index + 1,
          };
        });
        state.Images.push({
          Location: '',
          ETag: '',
          Bucket: '',
          key: Math.floor(Math.random() * 1000000).toString(),
          index: Number(state.User?.avatars?.length ?? [].length - 1),
          imageType: '',
        });
        state.User.avatars = state.User?.avatars
          ?.filter((avatar) => avatar.key !== action.payload)
          ?.map((image, index) => {
            return {
              ...image,
              index: index + 1,
            };
          });
      },
    );
    builder.addCase(deleteAvatar.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(changeAvatarSequence.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      changeAvatarSequence.fulfilled,
      (state, action: PayloadAction<ImageProps[]>) => {
        state.isLoading = false;
        state.Images = action.payload;
        state.User.avatars = action.payload;
      },
    );
    builder.addCase(changeAvatarSequence.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      updateProfile.fulfilled,
      (state, action: PayloadAction<UserProps>) => {
        state.isLoading = false;
        state.User = {
          ...state.User,
          ...action.payload,
        };
      },
    );
    builder.addCase(updateProfile.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateInfo.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      updateInfo.fulfilled,
      (state, action: PayloadAction<InfoProps>) => {
        state.isLoading = false;
        state.User = {
          ...state.User,
          ...action.payload,
        };
      },
    );
    builder.addCase(updateInfo.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(updateNotification.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      updateNotification.fulfilled,
      (state, action: PayloadAction<NotificationProps>) => {
        state.isLoading = false;
        state.User.notifications = action.payload;
      },
    );
    builder.addCase(updateNotification.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(getBlockUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      getBlockUsers.fulfilled,
      (state, action: PayloadAction<UserProps[]>) => {
        state.isLoading = false;
        state.Blocked = action.payload;
      },
    );
    builder.addCase(getBlockUsers.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(unBlockUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      unBlockUser.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.Blocked = state.Blocked.filter(
          (user) => user.uuid !== action.payload,
        );
      },
    );
    builder.addCase(unBlockUser.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(myProfileMedia.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      myProfileMedia.fulfilled,
      (state, action: PayloadAction<MyProfileMediaProps>) => {
        state.isLoading = false;
        state.MyProfile = action.payload;
      },
    );
    builder.addCase(myProfileMedia.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(loginWithProvider.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      loginWithProvider.fulfilled,
      (
        state,
        action: PayloadAction<{
          user: UserProps;
          statusCode?: number;
        }>,
      ) => {
        state.User = action.payload.user;
        state.isLoading = false;
      },
    );
    builder.addCase(loginWithProvider.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(Register.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      Register.fulfilled,
      (state, action: PayloadAction<UserProps>) => {
        state.isLoading = false;
        state.User = {
          ...state.User,
          ...action.payload,
        };
      },
    );
    builder.addCase(Register.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(Logout.pending, (state) => {
      state.isLoading = true;
      state.isLoggedIn = false;
      state.statusCode = null;
    });
    builder.addCase(Logout.fulfilled, (state) => {
      state.isLoading = false;
      state.User = {} as UserProps;
      state.Images = defaultImageState;
      state.isLoggedIn = false;
    });
    builder.addCase(Logout.rejected, (state) => {
      state.isLoading = false;
      state.User = {} as UserProps;
      state.Images = defaultImageState;
      state.isLoggedIn = false;
    });
    builder.addCase(deleteAccount.pending, (state) => {
      state.isLoading = true;
      state.isLoggedIn = false;
      state.statusCode = null;
    });
    builder.addCase(deleteAccount.fulfilled, (state) => {
      state.isLoading = false;
      state.User = {} as UserProps;
      state.Images = defaultImageState;
      state.isLoggedIn = false;
    });
    builder.addCase(deleteAccount.rejected, (state) => {
      state.isLoading = false;
      state.User = {} as UserProps;
      state.Images = defaultImageState;
      state.isLoggedIn = false;
    });
  },
});

export default userSlice.reducer;
export const {
  setUser,
  setIsLoading,
  setIsLoggedIn,
  setPicture,
  setResetInitialState,
} = userSlice.actions;
