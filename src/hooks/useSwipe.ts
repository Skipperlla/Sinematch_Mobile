import { useCallback } from 'react';
import Animated from 'react-native-reanimated';
import { LayoutAnimation, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import {
  useAppNavigation,
  useConversation,
  useDiscovery,
  useNotification,
  useUser,
} from '@app/hooks';
import { Pages, SwipeStatus } from '@app/constants';
import { EStatus } from '@app/types/redux/discovery';

export default function useSwipe() {
  const { likeUserAction } = useDiscovery();
  const { getUserPercentForMatchAction, setUser, User } = useUser();
  const { createConversationAction } = useConversation();
  const { sendNotificationAction } = useNotification();
  const navigation = useAppNavigation();

  const handleCreateConversation = useCallback(
    async (userId: string, discoveryId: string) => {
      const conversation = await createConversationAction({
        receiverId: userId,
        discoveryId,
      });
      const percent = await getUserPercentForMatchAction(userId);
      navigation.navigate(Pages.Matched, {
        receiverId: userId,
        conversationId: conversation.uuid,
        receiverAvatar: conversation.members[0].avatars[0].Location,
        combinedMatchRatio: percent,
        receiverFullName: conversation.members[0].fullName,
        discoveryId,
      });
      return conversation.uuid;
    },
    [],
  );

  const sendNotification = useCallback(
    (
      senderStatus: EStatus,
      receiverStatus: EStatus,
      receiverId: string,
      status: EStatus,
      conversationId?: string,
      discoveryId?: string,
    ) => {
      if (senderStatus && !receiverStatus)
        sendNotificationAction({
          title: 'notification.newMatchRequest.title',
          body: 'notification.newMatchRequest.body',
          useTranslation: true,
          notificationType: 'matchRequests',
          receiverId,
          data: { openURL: 'myapp://likes' },
        });
      else if (status === SwipeStatus.MATCHED)
        sendNotificationAction({
          title: 'notification.matchAcceptance.title',
          body: 'notification.matchAcceptance.body',
          useTranslation: true,
          notificationType: 'matchAcceptance',
          receiverId,
          data: {
            openURL: `myapp://chatDetail/${conversationId}/${discoveryId}/${User.fullName}/${receiverId}`,
          },
        });
    },
    [],
  );

  const swipeRight = useCallback(
    async (userId: string, swipeBack?: Animated.SharedValue<boolean>) => {
      try {
        const {
          matchResetCountdown,
          status,
          discoveryId,
          senderStatus,
          receiverStatus,
          user,
        } = await likeUserAction(userId);
        setUser({
          matchResetCountdown,
        });

        if (senderStatus && !receiverStatus)
          sendNotification(
            senderStatus,
            receiverStatus,
            String(user.uuid),
            status,
            '',
            discoveryId,
          );
        if (status === SwipeStatus.MATCHED) {
          const conversationId = await handleCreateConversation(
            userId,
            discoveryId,
          );
          sendNotification(
            senderStatus,
            receiverStatus,
            String(user.uuid),
            status,
            conversationId,
            discoveryId,
          );
        }
      } catch (err) {
        const error = err as { statusCode: number; message: string };
        if (error.statusCode === 402 && swipeBack) {
          navigation.navigate(Pages.Subscribe);
          swipeBack.value = true;
        }
        return await Promise.reject(error);
      }
    },
    [],
  );
  const onLayoutAnimation = useCallback(
    <T>(list: React.RefObject<FlashList<T>>) => {
      if (Platform.OS === 'android') return;
      list.current?.prepareForLayoutAnimationRender();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    },
    [],
  );
  return { swipeRight, onLayoutAnimation };
}
