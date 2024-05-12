import { View, StyleSheet, Platform } from 'react-native';
import React, { memo, useCallback, useMemo } from 'react';
import Animated, {
  FadeInDown,
  FadeOutDown,
  Layout,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { useMutation } from '@tanstack/react-query';
import _ from 'lodash';

import { AttachmentButton } from '@app/components';
import {
  useApp,
  useConversation,
  useImagePicker,
  useNotification,
  useSetQueryData,
  useUser,
} from '@app/hooks';
import { Colors } from '@app/styles';
import { SocketContext, rs } from '@app/utils';
import { Pages, ScreenSizes } from '@app/constants';
import { MessageService } from '@app/api';
import type { RootRouteProps } from '@app/types/navigation';
import type { LocalSharePhotoProps, SharePhotoDataProps } from '@app/types/api';
import type { MessageResponseProps } from '@app/types/redux/message';

type Props = {
  showAttachment: boolean;
  onVisibleAttachment: () => void;
  onScrollToBottom: () => void;
};

const Attachment = ({
  showAttachment,
  onVisibleAttachment,
  onScrollToBottom,
}: Props) => {
  const { bottom } = useSafeAreaInsets();
  const { isDarkMode } = useApp();
  const { User } = useUser();
  const { setNewLastMessage } = useConversation();
  const { onImagePicker, onCamera } = useImagePicker();
  const { sendNotificationAction } = useNotification();
  const { params } = useRoute<RootRouteProps<Pages.Chat_Details>>();
  const { socket } = SocketContext.useSocketContext();
  const setMessagesData = useSetQueryData<LocalSharePhotoProps[]>();

  const onMutate = useCallback((data: SharePhotoDataProps) => {
    setMessagesData([params?.conversationId], (prevData = []) => {
      return [data.data, ...prevData];
    });
    onScrollToBottom && onScrollToBottom();
  }, []);
  const onSuccess = useCallback((data: MessageResponseProps) => {
    const newMessage = {
      ...data,
      conversationId: params.conversationId,
    };
    setNewLastMessage(newMessage);
    socket?.emit('sendMessage', {
      message: newMessage,
      conversationId: params.conversationId,
    });
    setMessagesData([params?.conversationId], (prevData = []) => {
      return _.map(prevData, (item) =>
        item.uuid === data.uuid ? { ...item, status: data.status } : item,
      );
    });

    sendNotificationAction({
      title: String(User.fullName),
      body: 'notification.newMessage.body',
      useTranslation: true,
      notificationType: 'newMessage',
      receiverId: params.receiverId,
      data: {
        page: Pages.Chat_Details,
        openURL: `myapp://chatDetail/${params.conversationId}/${params.discoveryId}/${User.fullName}/${params.receiverId}`,
      },
    });
  }, []);

  const shareGalleryImage = useCallback(async () => {
    const data = await onImagePicker({
      width: 1200,
      height: 1200,
      cropping: true,
      mediaType: 'photo',
    });
    if (data) {
      const newMessage = {
        uuid: uuid.v4(),
        sender: User?._id,
        image: {
          Location: data?.uri,
          imageType: 'image',
          key: uuid.v4(),
        },
        createdAt: new Date(),
      };
      mutate({
        conversationId: params.conversationId,
        image: data,
        imageType: 'image',
        uuid: newMessage.uuid,
        data: newMessage,
      });
    }
  }, []);

  const shareCameraImage = useCallback(async () => {
    const data = await onCamera({
      width: 1200,
      height: 1200,
      cropping: true,
      mediaType: 'photo',
    });
    if (data) {
      const newMessage = {
        uuid: uuid.v4(),
        sender: User?._id,
        image: {
          Location: data?.uri,
          imageType: 'camera',
          key: uuid.v4(),
        },
        createdAt: new Date(),
      };
      mutate({
        conversationId: params.conversationId,
        image: data,
        imageType: 'camera',
        uuid: newMessage.uuid,
        data: newMessage,
      });
    }
  }, []);

  const attachments = [
    {
      icon: 'bold_camera',
      label: 'screens.chatDetail.camera',
      color: Colors.orange,
      onPress: shareCameraImage,
    },
    {
      icon: 'bold_image',
      label: 'screens.chatDetail.image',
      color: Colors.green,
      onPress: shareGalleryImage,
    },
  ];

  const memoizedAttachments = useMemo(() => {
    return attachments.map((attachment, index) => {
      return (
        <AttachmentButton
          key={index}
          backgroundColor={attachment.color}
          icon={attachment.icon}
          label={attachment.label}
          onPress={() => {
            onVisibleAttachment();
            attachment.onPress();
          }}
        />
      );
    });
  }, []);

  const { mutate } = useMutation(
    ['message', params?.conversationId],
    (dataToSend) => MessageService.sharePhoto(dataToSend),
    {
      onMutate: onMutate,
      onSuccess: onSuccess,
    },
  );

  return (
    <Animated.View
      key={String(showAttachment)}
      entering={Platform.OS === 'ios' ? FadeInDown : undefined}
      exiting={Platform.OS === 'ios' ? FadeOutDown : undefined}
      layout={Platform.OS === 'android' ? undefined : Layout.springify()}
      style={[
        {
          display: showAttachment ? 'flex' : 'none',
          bottom: rs(Math.max(24, bottom) + 56),
        },
        styles.container,
      ]}
    >
      <View
        style={[
          styles.attachmentContainer,
          {
            backgroundColor: isDarkMode ? Colors.dark3 : Colors.white,
          },
        ]}
      >
        {memoizedAttachments}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: ScreenSizes.screenWidth,
    zIndex: 10,
  },
  attachmentContainer: {
    alignSelf: 'center',
    gap: rs(15),
    padding: rs(24),
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(Attachment);
