import { Pages } from '@app/constants';
import { UserProps } from './redux/user';

export type EditType = 'Favorite' | 'Genre' | 'Gender' | 'Avatars';

export type RootStackParamList = {
  [Pages.LetsYouIn]?: undefined;
  [Pages.Media]?: {
    id: number;
    mediaType: string;
  };
  [Pages.Matched]?: {
    receiverId: string;
    conversationId: string;
    receiverAvatar: string;
    combinedMatchRatio: number;
    receiverFullName: string;
    discoveryId: string;
  };
  [Pages.Subscribe]?: undefined;
  [Pages.FullName]?: undefined;
  [Pages.Username]?: undefined;
  [Pages.Email]?: undefined;
  [Pages.Biography]?: undefined;
  [Pages.Birthday]?: undefined;
  [Pages.Gender]?: undefined;
  [Pages.Gender_Preference]?: undefined;
  [Pages.Genre]?: undefined;
  [Pages.Favorite]?: undefined;
  [Pages.Avatar]?: undefined;
  [Pages.Swipe_Back]?: {
    user: UserProps;
    userId: string;
  };
  // [Pages.Location_Permission]?: undefined;
  // Bottom Tab
  [Pages.Bottom_Tab]?: undefined;
  [Pages.Matches]?: undefined;
  [Pages.Home]?: undefined;
  [Pages.Profile]?: undefined;
  [Pages.Chats]?: undefined;
  [Pages.Chat_Details]?: {
    conversationId: string;
    receiverId: string;
    receiverFullName: string;
    discoveryId: string;
  };
  [Pages.Profile_Detail]?: {
    userId: string;
    discoveryId?: string;
    conversationId?: string;
    isSwipeBackScreen?: boolean;
  };
  [Pages.Settings]?: undefined;
  [Pages.Help_Center]?: undefined;
  [Pages.Personal_Information]?: undefined;
  [Pages.Discovery_Settings]?: undefined;
  [Pages.Notifications]?: undefined;
  [Pages.Blocked_Users]?: undefined;
  [Pages.Language]?: undefined;
  [Pages.Edit_Profile]?: undefined;
  [Pages.My_Profile]?: undefined;
  [Pages.Privacy_Policy]?: undefined;
  [Pages.Terms_Of_Service]?: undefined;
  [Pages.Chat_Image]?: {
    uri?: string;
    conversationId: string;
  };
  [Pages.Single_Edit_Profile]?: {
    editType?: EditType;
  };
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
