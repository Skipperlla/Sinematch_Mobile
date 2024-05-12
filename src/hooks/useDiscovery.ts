import {
  allDiscoveries,
  likeUser,
  undoUser,
  rejectUser,
  resetDiscovery as resetDiscoveryReducer,
  setDiscoveries as setDiscoveriesReducer,
  setLikes as setLikesReducer,
  setIgnored as setIgnoredReducer,
  resetInitialState as resetInitialStateReducer,
  Likes,
  ignored,
  deleteDiscovery,
} from '@app/store/discovery.slice';
import { useAction, useAppDispatch, useAppSelector } from '@app/hooks';

export default function useDiscovery() {
  const dispatch = useAppDispatch();

  const allDiscoveriesAction = useAction(allDiscoveries);
  const likeUserAction = useAction(likeUser);
  const undoUserAction = useAction(undoUser);
  const rejectUserAction = useAction(rejectUser);
  const likesAction = useAction(Likes);
  const ignoredAction = useAction(ignored);
  const deleteDiscoveryAction = useAction(deleteDiscovery);

  const resetDiscovery = () => dispatch(resetDiscoveryReducer());
  const setDiscoveries = (userId: string) =>
    dispatch(setDiscoveriesReducer(userId));
  const resetInitialState = () => dispatch(resetInitialStateReducer());

  const setLikes = (discoveryId: string) =>
    dispatch(setLikesReducer(discoveryId));
  const setIgnored = (discoveryId: string) =>
    dispatch(setIgnoredReducer(discoveryId));

  const discovery = useAppSelector((state) => state.discovery);

  return {
    ...discovery,
    allDiscoveriesAction,
    likeUserAction,
    undoUserAction,
    rejectUserAction,
    resetDiscovery,
    likesAction,
    ignoredAction,
    setDiscoveries,
    deleteDiscoveryAction,
    setLikes,
    setIgnored,
    resetInitialState,
  };
}
