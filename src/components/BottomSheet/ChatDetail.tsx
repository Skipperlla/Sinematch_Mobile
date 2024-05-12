import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

import { Icon, Text } from '@app/components';
import { Colors } from '@app/styles';
import { SocketContext, rs } from '@app/utils';
import {
  useApp,
  useAppNavigation,
  useConversation,
  useDiscovery,
  useUser,
  useTranslation,
} from '@app/hooks';

type Props = {
  receiverFullName: string;
  discoveryId: string;
  receiverId: string;
  conversationId: string;
};

const _ChatDetail = ({
  receiverFullName,
  discoveryId,
  receiverId,
  conversationId,
}: Props) => {
  const { bottom } = useSafeAreaInsets();
  const { dismissAll } = useBottomSheetModal();
  const { t } = useTranslation();
  const { socket } = SocketContext.useSocketContext();
  const { isDarkMode } = useApp();
  const { blockUserAction } = useUser();
  const { endConversationAction } = useConversation();
  const { deleteDiscoveryAction } = useDiscovery();
  const navigation = useAppNavigation();

  const onEndConversation = useCallback(async () => {
    await endConversationAction({
      receiverId,
      conversationId,
    });
    socket?.emit('leaveConversation', conversationId);
    await deleteDiscoveryAction({
      receiverId,
      discoveryId,
    });
    dismissAll();
    navigation.goBack();
  }, []);
  const onBlockAndEndConversation = useCallback(async () => {
    await blockUserAction(receiverId);
    await endConversationAction({
      receiverId,
      conversationId,
    });
    socket?.emit('leaveConversation', conversationId);
    dismissAll();
    navigation.goBack();
  }, []);
  const onShowModal = useCallback(
    (label: string, description: string, button: string, func: () => void) =>
      Alert.alert(
        t(label),
        String(t(description, { fullName: receiverFullName })),
        [
          {
            text: String(t('components.bottomSheet.chatDetail.cancel')),
            style: 'cancel',
          },
          {
            text: String(t(button)),
            onPress: func,
            style: 'destructive',
          },
        ],
        { cancelable: false },
      ),
    [],
  );

  const actions = [
    {
      label: 'components.bottomSheet.chatDetail.endConversation',
      description:
        'components.bottomSheet.chatDetail.endConversationDescription',
      button: 'components.bottomSheet.chatDetail.endConversationButton',
      function: onEndConversation,
    },
    {
      label: 'components.bottomSheet.chatDetail.block',
      description: 'components.bottomSheet.chatDetail.blockDescription',
      button: 'components.bottomSheet.chatDetail.blockButton',
      function: onBlockAndEndConversation,
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          marginBottom: bottom ?? 24,
        },
      ]}
    >
      {actions.map((action, index) => {
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onShowModal(
                action.label,
                action.description,
                action.button,
                action.function,
              );
            }}
            key={index}
          >
            <Text text={action.label} fontFamily="medium" size="bodyLarge" />
            <Icon
              icon="light_arrow_right_2"
              color={isDarkMode ? Colors.white : Colors.grey900}
              size={rs(24)}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rs(24),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: rs(16),
  },
});

export default memo(_ChatDetail);
