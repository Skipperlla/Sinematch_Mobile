import {
  setUser as setUserReducer,
  setIsLoggedIn as setIsLoggedInReducer,
  discoverySettings,
  addGenre,
  removeGenre,
  addFavorite,
  removeFavorite,
  uploadProfilePhoto,
  changePrimaryAvatar,
  deleteAvatar,
  changeAvatarSequence,
  setPicture as setPictureReducer,
  setResetInitialState as setResetInitialStateReducer,
  isLoggedIn,
  setLocation,
  updateProfile,
  getUserPercentForMatch,
  blockUser,
  updateNotification,
  getBlockUsers,
  unBlockUser,
  myProfileMedia,
  loginWithProvider,
  Register,
  Logout,
  deleteAccount,
  updateInfo,
} from '@app/store/user.slice';
import { useAction, useAppDispatch, useAppSelector } from '@app/hooks';
import type { ImageProps, UserProps } from '@app/types/redux/user';

export default function useUser() {
  const dispatch = useAppDispatch();

  const discoverySettingsAction = useAction(discoverySettings);
  const isLoggedInAction = useAction(isLoggedIn);
  const addGenreAction = useAction(addGenre);
  const removeGenreAction = useAction(removeGenre);
  const addFavoriteAction = useAction(addFavorite);
  const removeFavoriteAction = useAction(removeFavorite);
  const uploadProfilePhotoAction = useAction(uploadProfilePhoto);
  const changePrimaryAvatarAction = useAction(changePrimaryAvatar);
  const deleteAvatarAction = useAction(deleteAvatar);
  const changeAvatarSequenceAction = useAction(changeAvatarSequence);
  const setLocationAction = useAction(setLocation);
  const updateProfileAction = useAction(updateProfile);
  const updateInfoAction = useAction(updateInfo);
  const getUserPercentForMatchAction = useAction(getUserPercentForMatch);
  const blockUserAction = useAction(blockUser);
  const updateNotificationAction = useAction(updateNotification);
  const getBlockUsersAction = useAction(getBlockUsers);
  const unBlockUserAction = useAction(unBlockUser);
  const myProfileMediaAction = useAction(myProfileMedia);
  const loginWithProviderAction = useAction(loginWithProvider);
  const registerAction = useAction(Register);
  const logoutAction = useAction(Logout);
  const deleteAccountAction = useAction(deleteAccount);

  const setUser = (payload: UserProps) => dispatch(setUserReducer(payload));
  const setIsLoggedIn = (payload: boolean) =>
    dispatch(setIsLoggedInReducer(payload));
  const setPicture = (payload: ImageProps[]) =>
    dispatch(setPictureReducer(payload));
  const setResetInitialState = () => dispatch(setResetInitialStateReducer());

  const user = useAppSelector((state) => state.user);

  return {
    ...user,
    setUser,
    setIsLoggedIn,
    discoverySettingsAction,
    addGenreAction,
    removeGenreAction,
    addFavoriteAction,
    removeFavoriteAction,
    uploadProfilePhotoAction,
    changePrimaryAvatarAction,
    deleteAvatarAction,
    changeAvatarSequenceAction,
    setPicture,
    isLoggedInAction,
    setLocationAction,
    updateProfileAction,
    setResetInitialState,
    getUserPercentForMatchAction,
    blockUserAction,
    updateNotificationAction,
    getBlockUsersAction,
    unBlockUserAction,
    myProfileMediaAction,
    loginWithProviderAction,
    registerAction,
    logoutAction,
    deleteAccountAction,
    updateInfoAction,
  };
}
