import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { memo, useCallback, useMemo, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { clamp, snapPoint } from 'react-native-redash';

import { FastImage, Icon, LoadingBubble, Text } from '@app/components/';
import { SocketContext, lib, rs } from '@app/utils';
import {
  useApp,
  useTranslation,
  useAppNavigation,
  useConversation,
} from '@app/hooks';
import { Pages, ScreenSizes } from '@app/constants';
import { Colors } from '@app/styles';
import type { MessageResponseProps } from '@app/types/redux/message';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
  uri: string;
  fullName: string;
  lastMessage?: MessageResponseProps;
  onRemoveItem: () => Promise<void>;
  createdAt?: Date;
  conversationId: string;
  isRead?: boolean;
  isOwnerLastMessage: boolean;
  receiverId: string;
  discoveryId: string;
};

//* Animated
type Context = {
  startX: number;
};
const LIST_ITEM_HEIGHT = 70;
const MAX_TRANSLATE = 80;
const springConfig = (velocity: number) => {
  'worklet';
  return {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    velocity,
  };
};

const _Conversation = ({
  uri,
  fullName,
  lastMessage,
  onRemoveItem,
  createdAt,
  conversationId,
  isOwnerLastMessage,
  isRead,
  receiverId,
  discoveryId,
}: Props) => {
  const { isDarkMode } = useApp();
  const { isLoading } = useConversation();
  const { socket } = SocketContext.useSocketContext();
  const { t } = useTranslation();
  const navigation = useAppNavigation();
  const translateX = useSharedValue(0);
  const [isWrite, setIsWrite] = useState(false);

  const message = useMemo(() => {
    if (lastMessage?.text) return lastMessage.text;
    const mediaIcon = lastMessage?.image
      ? '📷'
      : t(`mediaTypes.${lastMessage?.media?.mediaType}`).toLowerCase();
    const messageTemplate = isOwnerLastMessage
      ? 'screens.chats.shareOwner'
      : 'screens.chats.shareReceiver';
    return t(messageTemplate, { object: mediaIcon });
  }, [lastMessage]);

  const rStyle = useAnimatedStyle(() => {
    const translate = interpolate(
      translateX.value,
      [-MAX_TRANSLATE, 0],
      [-MAX_TRANSLATE, 0],
    );
    return {
      transform: [{ translateX: translate > 0 ? 0 : translate }],
    };
  });
  const resetPosition = useCallback(() => {
    const timer = setTimeout(() => {
      translateX.value = withSpring(0, springConfig(0));
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  const rIconContainerStyle = useAnimatedStyle(() => {
    const opacityValue = withTiming(
      translateX.value < -MAX_TRANSLATE + 10 ? 1 : 0,
    );
    return { transform: [{ scale: opacityValue }] };
  });
  const panGesture = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    Context
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = clamp(
        event.translationX + ctx.startX,
        -MAX_TRANSLATE,
        MAX_TRANSLATE,
      );
    },
    onEnd: (event) => {
      const sameDirection =
        (event.translationX > 0 && translateX.value > 0) ||
        (event.translationX < 0 && translateX.value < 0);

      if (sameDirection) {
        translateX.value = withSpring(
          snapPoint(event.translationX, event.velocityX, [
            0,
            event.translationX > 0 ? MAX_TRANSLATE : -MAX_TRANSLATE,
          ]),
          springConfig(event.velocityX),
          () => runOnJS(resetPosition)(),
        );
      } else translateX.value = withSpring(0, springConfig(event.velocityX));
    },
  });

  const navigateToChatDetails = useCallback(() => {
    if (translateX.value !== 0)
      return (translateX.value = withSpring(0, springConfig(0)));
    console.log({
      conversationId,
      receiverId,
      receiverFullName: fullName,
      discoveryId,
    });
    navigation.navigate(Pages.Chat_Details, {
      conversationId,
      receiverId,
      receiverFullName: fullName,
      discoveryId,
    });
  }, []);
  const navigateToProfileDetail = useCallback(() => {
    if (translateX.value !== 0)
      return (translateX.value = withSpring(0, springConfig(0)));

    navigation.navigate(Pages.Profile_Detail, {
      userId: receiverId,
      discoveryId,
      conversationId,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (socket) {
        socket.on(
          'usersWhoWrote',
          ({
            isTyping,
            conversationId: socketConversationId,
          }: {
            isTyping: boolean;
            conversationId: string;
          }) => {
            if (socketConversationId === conversationId) {
              if (isTyping) setIsWrite(isTyping);
              else setIsWrite(isTyping);
            }
          },
        );
      }
    }, [socket]),
  );

  return (
    <>
      <Animated.View style={[styles.iconContainer, rIconContainerStyle]}>
        <TouchableOpacity
          disabled={isLoading}
          onPress={() => {
            onRemoveItem().then(
              () => (translateX.value = withSpring(0, springConfig(0))),
            );
          }}
        >
          <Icon
            size={LIST_ITEM_HEIGHT * 0.4}
            icon="light_outline_delete"
            color={Colors.red}
          />
        </TouchableOpacity>
      </Animated.View>
      <PanGestureHandler onGestureEvent={panGesture} activeOffsetX={[-10, 10]}>
        <Animated.View style={rStyle} pointerEvents={'box-none'}>
          <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPress={navigateToChatDetails}
          >
            <TouchableOpacity
              onPress={navigateToProfileDetail}
              activeOpacity={1}
            >
              <FastImage uri={uri} width={60} height={60} borderRadius={999} />
            </TouchableOpacity>
            <View style={styles.userInfoContainer}>
              <Text fontFamily="bold" size="h6" text={fullName} />
              {isWrite ? (
                <LoadingBubble size={8} style={styles.bubble} />
              ) : (
                <Text
                  fontFamily="medium"
                  size="bodyMedium"
                  color={isDarkMode ? 'grey300' : 'grey700'}
                  numberOfLines={1}
                  text={message}
                  style={styles.lastMessage}
                />
              )}
            </View>
            <View style={styles.actionContainer}>
              <LinearGradient
                colors={Colors.gradientPurple}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.badge,
                  {
                    opacity: !isRead && !isOwnerLastMessage ? 1 : 0,
                  },
                ]}
              />
              <Text
                fontFamily="medium"
                size="bodyMedium"
                color={isDarkMode ? 'grey300' : 'grey700'}
                text={lib.formatDate(createdAt)}
              />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: ScreenSizes.screenWidth - rs(24 * 2),
    marginBottom: rs(20),
  },
  userInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    marginRight: rs(12),
    marginLeft: rs(16),
    gap: rs(6),
  },
  lastMessage: {
    letterSpacing: 0.2,
  },
  messageContainer: {
    marginTop: rs(6),
  },
  badge: {
    width: rs(12),
    height: rs(12),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    top: 5,
    gap: rs(6),
  },
  iconContainer: {
    height: 70,
    width: 70,
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    marginTop: rs(10),
  },
});

export default memo(_Conversation);
