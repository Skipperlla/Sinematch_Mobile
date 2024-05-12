import {
  Genres,
  multiSearch,
  popularMedias,
  setFavorite as setFavoriteReducer,
  setResetState as setResetStateReducer,
  setIsSearching as setIsSearchingReducer,
  setSelectedFavorites as setSelectedFavoritesReducer,
  multipleSetFavorite as multipleSetFavoriteReducer,
} from '@app/store/media.slice';
import { MediaProps } from 'types/redux/media';

import { useAction, useAppDispatch, useAppSelector } from '@app/hooks';

export default function useMedia() {
  const dispatch = useAppDispatch();

  const genresAction = useAction(Genres);
  const popularMediasAction = useAction(popularMedias);
  const multiSearchAction = useAction(multiSearch);

  const setResetState = () => dispatch(setResetStateReducer());
  const setFavorite = (action: MediaProps) =>
    dispatch(setFavoriteReducer(action));
  const multipleSetFavorite = (action: MediaProps[]) =>
    dispatch(multipleSetFavoriteReducer(action));
  const setIsSearching = (payload: boolean) =>
    dispatch(setIsSearchingReducer(payload));
  const setSelectedFavorites = (payload: MediaProps[]) =>
    dispatch(setSelectedFavoritesReducer(payload));

  const media = useAppSelector((state) => state.media);

  return {
    ...media,
    genresAction,
    popularMediasAction,
    multiSearchAction,
    setFavorite,
    setResetState,
    setIsSearching,
    setSelectedFavorites,
    multipleSetFavorite,
  };
}
