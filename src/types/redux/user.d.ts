import { Platform } from 'react-native';

import { GenreProps, MediaProps } from './media';

export type UserProps = {
  _id?: string;
  fullName?: string;
  userName?: string;
  notifications?: NotificationProps;
  password?: string;
  discoverySettings?: DiscoverySettingsProps;
  matchLikeCount?: number;
  superLikeCount?: number;
  isCompletedProfile?: boolean;
  matchResetCountdown?: Date;
  superLikeResetCountdown?: Date;
  email?: string;
  info?: InfoProps;
  avatars?: ImageProps[];
  plan?: EPlans;
  favMovies?: MediaProps[];
  favSeries?: MediaProps[];
  genres?: (string | GenreProps)[];
  blocks?: string[];
  platform?: Platform.OS;
  //TODO: It will change according to the information coming from the phone.
  region?: object;
  //TODO: It will change according to the information coming from the phone.
  appLanguage?: string;
  uuid?: string;
  lastSeen?: Date;
  location?: {
    type: string;
    coordinates: number[];
  };
  logins?: Array<{
    ip: string;
    date: Date;
  }>;
  status?: EStatus;
};

type NotificationProps = {
  newMessage: boolean;
  matchRequests: boolean;
  matchAcceptance: boolean;
};
type DiscoverySettingsProps = {
  ageRange?: {
    min: Date | number;
    max: Date | number;
  };
  genderPreference?: EGendersPreferences;
  matchType?: EMatchTypes; // ? 1 = Film, 2 = Dizi, 3 = İkiside
};
enum EGendersPreferences {
  MALE = 1,
  FEMALE = 2,
  BOTH = 3,
}

enum EMatchTypes {
  MOVIE = 1,
  SERIES = 2,
  BOTH = 3,
}
export type InfoProps = {
  biography?: string;
  birthday?: Date;
  gender?: EGenders;
};

type ImageProps = {
  Location: string;
  ETag: string;
  Bucket: string;
  key: string;
  index: number;
  imageType: string;
};
export enum EPlans {
  NONE = 1,
  PLUS = 2,
  GOLD = 3,
}

enum EStatus {
  OK = 1,
  WARNING = 2,
  BLOCKED = 3,
  BAN = 4,
}
export type FormDataProps = {
  uri: string;
  name: string;
  type: string;
};
export type DeleteAvatarProps = {
  key: string;
  Bucket: string;
};
export type CommonGenreProps = {
  name: string;
  percentage: number;
};
export type CompareProfileProps = {
  commonGenres: Array<{
    name: string;
    percentage: number;
  }>;
  matchPercent: number;
  movie: MediaProps[][];
  series: MediaProps[][];
  receiverMedia: {
    movie: MediaProps[][];
    series: MediaProps[][];
    genres: CommonGenreProps[];
  };
  receiver: UserProps;
};
export type MyProfileMediaProps = {
  movies: MediaProps[][];
  series: MediaProps[][];
  genres: CommonGenreProps[];
};
