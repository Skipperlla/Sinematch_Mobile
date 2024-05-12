import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import React, { memo, useCallback } from 'react';

import {
  useAppNavigation,
  useConversation,
  useDiscovery,
  useTranslation,
} from '@app/hooks';
import { Pages } from '@app/constants';
import { SocketContext, lib, rs } from '@app/utils';
import { FastImage } from '@app/components';

type Props = {
  receiverId: string;
  conversationId: string;
  avatar: string;
  fullName: string;
  discoveryId: string;
};

const _NewMatchCard = ({
  receiverId,
  conversationId,
  avatar,
  fullName,
  discoveryId,
}: Props) => {
  const { endConversationAction, isLoading } = useConversation();
  const { deleteDiscoveryAction } = useDiscovery();
  const { socket } = SocketContext.useSocketContext();
  const { t } = useTranslation();
  const scale = useSharedValue(1);
  const navigation = useAppNavigation();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const navigate = useCallback(
    () =>
      navigation.navigate(Pages.Chat_Details, {
        conversationId,
        receiverId,
        receiverFullName: fullName,
        discoveryId,
      }),
    [],
  );
  const onRemoveItem = useCallback(() => {
    scale.value = withSpring(0.9, lib.springConfig(10, 200));
    Alert.alert(
      t('screens.chats.alertTitle'),
      String(t('screens.chats.alertDescription')),
      [
        {
          text: String(t('screens.chats.cancel')),
          style: 'cancel',
        },
        {
          text: String(t('screens.chats.delete')),
          style: 'destructive',
          onPress: () =>
            endConversationAction({
              receiverId,
              conversationId,
            }).then(() => {
              socket?.emit('leaveConversation', conversationId);
              deleteDiscoveryAction({
                receiverId,
                discoveryId,
              });
            }),
        },
      ],
    );
  }, []);
  const onPressOut = useCallback(
    () => (scale.value = withSpring(1, lib.springConfig(25, 150))),
    [],
  );

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={styles.button}
        onLongPress={onRemoveItem}
        onPressOut={onPressOut}
        onPress={navigate}
        activeOpacity={1}
        disabled={isLoading}
      >
        <FastImage uri={avatar} width={80} height={80} borderRadius={999} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: rs(80),
    height: rs(80),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rs(16),
  },
});

export default memo(_NewMatchCard);
