import { ImageProps, InfoProps, UserProps } from './user';

export enum EStatus {
  LIKE = 1,
  MATCHED = 2,
  UNDO = 3,
  WAITING = 4,
  REJECT = 5,
  NOT_MATCHED = 6,
}

type DiscoveriesProps = {
  info: InfoProps;
  _id: string;
  fullName: string;
  avatars: ImageProps[];
  uuid: string;
  plan: 1 | 2;
};

type LikeUserProps = {
  _id: string;
  discoveryId: string;
  user: UserProps;
  status: EStatus;
  matchResetCountdown: Date;
  receiverStatus: EStatus;
  senderStatus: EStatus;
};

type RejectUserProps = {
  _id: string;
  discoveryId: string;
  user: UserProps;
  status: EStatus;
};
type DiscoveriesReturnProps = {
  discoveries: DiscoveriesProps[];
  count: number;
};
type LikesResponseProps = {
  discoveries: LikesProps[];
  count: number;
};
type IgnoredResponseProps = {
  discoveries: IgnoredProps[];
  count: number;
};
type DiscoveryState = {
  Discoveries: DiscoveriesProps[];
  Likes: LikesResponseProps;
  Ignored: IgnoredResponseProps;
  isLoading: boolean;
  statusCode: number | null;
  isSwipeDisabled: boolean;
};
type UndoUserProps = {
  receiverId: string;
  discoveryId: string;
};
type LikesProps = {
  _id: string;
  sender: UserProps;
  uuid: string;
};
type IgnoredProps = {
  user: UserProps;
  uuid: string;
};
type DeleteDiscoveryParamsProps = {
  receiverId: string;
  discoveryId: string;
};
type UndoUserResponseProps = {
  user: UserProps;
  discoveryId: string;
  status: EStatus;
};
type OverlayLabelType = {
  inputRange: readonly number[];
  direction: 'right' | 'left';
};
type CatchErrorProps = {
  message: string;
  statusCode: number;
};

export type {
  IgnoredProps,
  DiscoveryState,
  LikesResponseProps,
  DiscoveriesReturnProps,
  DiscoveriesProps,
  LikesProps,
  LikeUserProps,
  CatchErrorProps,
  UndoUserProps,
  DiscoveryProps,
  RejectUserProps,
  CompareProfileProps,
  IgnoredResponseProps,
  DeleteDiscoveryParamsProps,
  UndoUserResponseProps,
  OverlayLabelType,
};
