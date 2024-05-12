import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  LayoutChangeEvent,
  View,
  Keyboard,
  Platform,
} from 'react-native';
import _, { debounce } from 'lodash';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';

import {
  useConversation,
  useInteractiveKeyboardAnimation,
  useNotification,
  useSetQueryData,
  useUser,
  useTranslation,
  useApp,
} from '@app/hooks';
import { Colors, Fonts, Sizes } from '@app/styles';
import { MessageService } from '@app/api';
import { Pages } from '@app/constants';
import { SocketContext, rs } from '@app/utils';
import { Icon } from '@app/components';
import type { RootRouteProps } from '@app/types/navigation';
import type { MessageResponseProps } from '@app/types/redux/message';
import type { CreateMessageDataProps, LocalMessageProps } from '@app/types/api';

import Attachment from './Attachment';

type Props = {
  onLayout: ({ nativeEvent }: LayoutChangeEvent) => void;
  onScrollToBottom: () => void;
};

const Index = ({ onLayout, onScrollToBottom }: Props) => {
  const { height, progress } = useInteractiveKeyboardAnimation();
  const { isDarkMode } = useApp();
  const { t } = useTranslation();
  const { User } = useUser();
  const { params } = useRoute<RootRouteProps<Pages.Chat_Details>>();
  const { bottom } = useSafeAreaInsets();
  const { setNewLastMessage } = useConversation();
  const { sendNotificationAction } = useNotification();
  const { socket } = SocketContext.useSocketContext();
  const previousIsComplete = useRef(false);
  const setMessagesData = useSetQueryData<LocalMessageProps[]>();
  const [text, setText] = useState('');
  const [showAttachment, setShowAttachment] = useState<boolean>(false);

  const { status } = useQuery(
    [params.conversationId],
    () => MessageService.messages(params.conversationId),
    {
      enabled: false,
    },
  );

  const onSuccess = useCallback(async (data: MessageResponseProps) => {
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
        item.uuid === data.uuid ? { ...data, ...item } : item,
      );
    });
    sendNotificationAction({
      title: String(User.fullName),
      body: String(data.text),
      useTranslation: false,
      notificationType: 'newMessage',
      receiverId: params.receiverId,
      data: {
        page: Pages.Chat_Details,
        openURL: `myapp://chatDetail/${params.conversationId}/${params.discoveryId}/${User.fullName}/${params.receiverId}`,
      },
    });
  }, []);
  const onMutate = useCallback((data: CreateMessageDataProps) => {
    setMessagesData([params?.conversationId], (prevData = []) => {
      return [data.data, ...prevData];
    });
    onScrollToBottom();
  }, []);
  const { mutate } = useMutation(
    ['message', params?.conversationId],
    (dataToSend) => MessageService.createMessage(dataToSend),
    {
      onMutate: onMutate,
      onSuccess: onSuccess,
    },
  );
  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.length < 0) return;
      socket?.emit('isTyping', {
        userId: User.uuid,
        conversationId: params.conversationId,
        isTyping: false,
      });
      previousIsComplete.current = false;
    }, 2500),
    [],
  );
  const onChangeText = useCallback((value: string) => {
    if (!previousIsComplete.current && value.trim()) {
      socket?.emit('isTyping', {
        userId: User.uuid,
        conversationId: params.conversationId,
        isTyping: true,
      });
      previousIsComplete.current = true;
    }
    setText(value);
    debouncedSearch(value.trim());
  }, []);
  function handleSendMessage() {
    if (!text.trim()) {
      setText('');
      return;
    }
    if (showAttachment) setShowAttachment(false);
    const serverData = {
      text: text.trim(),
      uuid: uuid.v4(),
      sender: User?._id,
    };

    setText('');
    mutate({ conversationId: params?.conversationId, data: serverData });
  }
  const onVisibleAttachment = useCallback(
    (value?: boolean) =>
      setShowAttachment((prev) => {
        if (typeof value === 'boolean') return value;
        return !prev;
      }),
    [],
  );
  const attachmentIcon = useMemo(() => {
    return (
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          onVisibleAttachment();
        }}
        disabled={status !== 'success'}
        style={[
          styles.attachmentIcon,
          {
            height: Platform.OS === 'ios' ? 37 : 45.5,
          },
        ]}
      >
        <Icon
          icon="attachment"
          size={rs(Platform.OS === 'ios' ? 24 : 26)}
          color={Colors.grey400}
        />
      </TouchableOpacity>
    );
  }, [status]);

  const textInputStyle = useAnimatedStyle(
    () => ({
      paddingBottom: bottom
        ? interpolate(progress.value, [1, 0], [10, bottom], Extrapolate.CLAMP)
        : 10,
      transform: [{ translateY: -height.value }],
    }),
    [],
  );

  return (
    <Animated.View
      style={[
        textInputStyle,
        styles.container,
        {
          backgroundColor: isDarkMode ? Colors.dark2 : Colors.white,
        },
      ]}
      onLayout={onLayout}
    >
      <Attachment
        showAttachment={showAttachment}
        onVisibleAttachment={onVisibleAttachment}
        onScrollToBottom={onScrollToBottom}
      />
      {attachmentIcon}
      <TextInput
        multiline
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? Colors.dark2 : Colors.white,
            color: isDarkMode ? Colors.white : Colors.grey900,
            //* Old Color #d1d1d6
            borderColor: isDarkMode ? Colors.dark3 : Colors.grey300,
          },
        ]}
        onChangeText={onChangeText}
        value={text}
        editable={status === 'success'}
        enablesReturnKeyAutomatically
        autoCorrect={false}
        placeholder={String(t('screens.chatDetail.textAreaPlaceholder'))}
        placeholderTextColor={Colors.grey500}
        maxLength={1000}
        onSubmitEditing={handleSendMessage}
        onFocus={() => {
          if (showAttachment) onVisibleAttachment(false);
        }}
      />
      <TouchableOpacity
        onPress={handleSendMessage}
        disabled={!text.trim() || status !== 'success'}
        style={[
          styles.sendButton,
          {
            opacity: text.trim() ? 1 : 0.5,
            width: Platform.OS === 'ios' ? 37 : 45.5,
            height: Platform.OS === 'ios' ? 37 : 45.5,
          },
        ]}
      >
        <View style={styles.sendIcon}>
          <Icon
            icon="bold_send"
            size={rs(Platform.OS === 'ios' ? 18 : 24)}
            color={Colors.white}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: rs(10),
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    minHeight: 33,
    maxHeight: 200,
    width: '100%',
    borderRadius: 16,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: Sizes.bodyMedium,
    color: Colors.grey900,
  },
  sendIcon: {
    transform: [{ rotate: '45deg' }],
    left: -2,
  },
  sendButton: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: Colors.primary500,
  },
  attachmentIcon: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
  },
});

export default Index;
