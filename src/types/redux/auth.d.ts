import { EGendersPreferences, UserProps } from './user';

type AuthState = {
  User: UserProps;
  isLoading: boolean;
  statusCode: number | null;
};

type LoginResponseProps = {
  results: { user: UserProps; accessToken: string };
  statusCode?: number;
};
type ProviderProps = {
  provider: string;
  providerId: string;
  email: string;
  fullName: string | null;
  uuid: string;
};

export type RegisterProps = {
  fullName?: string;
  userName?: string;
  email?: string;
  info?: {
    biography?: string;
    birthday?: string | Date;
    gender?: number;
  };
  genderPreference?: EGendersPreferences | null;
};
