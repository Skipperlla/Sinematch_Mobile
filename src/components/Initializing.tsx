import { Appearance, Platform } from 'react-native';
import { memo, useEffect } from 'react';
import { NotifyContextType, useNotify } from 'rn-notify';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { TOptions } from 'i18next';
import { Socket } from 'socket.io-client';
import dayjs from 'dayjs';
import tr from 'dayjs/locale/tr';
import en from 'dayjs/locale/en';
import crashlytics from '@react-native-firebase/crashlytics';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import duration from 'dayjs/plugin/duration';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { REVENUE_CAT_IOS_API_KEY, REVENUE_CAT_ANDROID_API_KEY } from '@env';

import {
  useApp,
  useAppNavigation,
  useConversation,
  useDiscovery,
  useUser,
  useTranslation,
  usePurchase,
} from '@app/hooks';
import { SocketContext } from '@app/utils';
import { mediaAPI, userAPI } from '@app/api';
import { Pages } from '@app/constants';
import i18n, { languageCode } from '@app/lang/_i18n';
import type { RootStackParamList } from '@app/types/navigation';
import type { MessageResponseProps } from '@app/types/redux/message';
import type { CreateConversationProps } from '@app/types/redux/conversation';

crashlytics().setCrashlyticsCollectionEnabled(!__DEV__);

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(duration);

const SOCKET_EVENTS = {
  GET_MESSAGE: 'getMessage',
  NEW_CONVERSATION: 'newConversation',
  BLOCK_USER: 'blockUser',
  END_CONVERSATION: 'endConversation',
};

const useSocketHandlers = ({
  socket,
  actions,
  navigation,
  notify,
  t,
}: Omit<UseSocketHandlersProps, 'actions'> & {
  actions: SpecificActionTypes;
}) => {
  const { logoutAction } = useUser();
  const { resetInitialState: resetInitialStateConversation } =
    useConversation();
  const { resetInitialState: resetInitialStateDiscovery } = useDiscovery();
  useEffect(() => {
    if (socket) {
      socket.on(SOCKET_EVENTS.GET_MESSAGE, actions.setNewLastMessage);
      socket.on(SOCKET_EVENTS.NEW_CONVERSATION, (conversation) => {
        actions.addConversation(conversation);
        socket.emit('joinConversation', conversation.uuid);
      });
      socket.on(SOCKET_EVENTS.BLOCK_USER, (userId) => {
        actions.setDiscoveries(userId);
        actions.setLikes(userId);
        actions.setIgnored(userId);
      });
      socket.on('connect_error', async (err) => {
        if (Number(err?.message) === 409) {
          await logoutAction();
          resetInitialStateConversation();
          resetInitialStateDiscovery();
        }
      });
      socket.on(SOCKET_EVENTS.END_CONVERSATION, (conversationId) => {
        const getCurrentRoute = navigation
          ?.getState()
          ?.routes?.some((route) => route.name === Pages.Chat_Details);

        socket.emit('leaveConversation', conversationId);
        actions.removeConversation(conversationId);
        if (getCurrentRoute) {
          notify.info({
            message: t('screens.chatDetail.userEndedConversation'),
            duration: 2500,
          });
          navigation.goBack();
        }
      });

      return () => {
        Object.values(SOCKET_EVENTS).forEach((event) => socket.off(event));
      };
    }
  }, [socket, navigation, notify, t]);
};

const Initializing = () => {
  const { isLoggedIn, isLoggedInAction, User, updateProfileAction } = useUser();
  const { t } = useTranslation();
  const { defaultLanguage, setDefaultLanguage, setTheme } = useApp();
  const { socket } = SocketContext.useSocketContext();
  const { setDiscoveries, setLikes, setIgnored, likesAction } = useDiscovery();
  const {
    addConversation,
    removeConversation,
    setNewLastMessage,
    allConversationsAction,
  } = useConversation();
  const { fetchPurchaseInfoAction } = usePurchase();
  const notify = useNotify();
  const navigation = useAppNavigation();
  const currentLanguage = isLoggedIn ? defaultLanguage : languageCode;

  const actions = {
    setNewLastMessage,
    addConversation,
    removeConversation,
    setDiscoveries,
    setLikes,
    setIgnored,
  };

  useSocketHandlers({
    socket,
    actions,
    navigation,
    notify,
    t,
  });

  useEffect(() => {
    if (isLoggedIn) {
      isLoggedInAction().then(async () => {
        const data = await fetchPurchaseInfoAction();
        updateProfileAction({
          platform: Platform.OS,
          appLanguage: currentLanguage,
          plan: data.activeSubscriptions.length ? 2 : 1,
        });
        allConversationsAction(20);
        likesAction(10);
        crashlytics().setUserId(String(User?.uuid));
      });
    }
  }, []);
  useEffect(() => {
    if (Appearance.getColorScheme() !== 'light') setTheme('light');
    setDefaultLanguage(currentLanguage);
    userAPI.defaults.headers.common['Accept-Language'] = currentLanguage;
    mediaAPI.defaults.headers.common['Accept-Language'] = currentLanguage;
    i18n.changeLanguage(currentLanguage);
    dayjs.locale(currentLanguage === 'tr' ? tr : en);
    Purchases.configure({
      apiKey:
        Platform.OS === 'ios'
          ? REVENUE_CAT_IOS_API_KEY
          : REVENUE_CAT_ANDROID_API_KEY,
    });
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }, []);

  return null;
};

type UseSocketHandlersProps = {
  socket?: Socket;
  navigation: NavigationContainerRefWithCurrent<RootStackParamList>;
  notify: NotifyContextType;
  t: (key: string, options?: TOptions) => string;
};

type SpecificActionTypes = {
  setNewLastMessage: (
    payload: MessageResponseProps & {
      conversationId: string;
    },
  ) => {
    payload: MessageResponseProps & {
      conversationId: string;
    };
    type: 'conversation/setNewLastMessage';
  };
  addConversation: (payload: CreateConversationProps) => {
    payload: CreateConversationProps;
    type: 'conversation/addConversation';
  };
  removeConversation: (payload: string) => {
    payload: string;
    type: 'conversation/removeConversation';
  };
  setDiscoveries: (userId: string) => {
    payload: string;
    type: 'discovery/setDiscoveries';
  };
  setLikes: (discoveryId: string) => {
    payload: string;
    type: 'discovery/setLikes';
  };
  setIgnored: (discoveryId: string) => {
    payload: string;
    type: 'discovery/setIgnored';
  };
};

export default memo(Initializing);
