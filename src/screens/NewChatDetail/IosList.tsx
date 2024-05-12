import { StyleSheet } from 'react-native';
import React, { forwardRef, memo, useCallback, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import _ from 'lodash';

import {
  useAppNavigation,
  useAppState,
  useConversation,
  useSetQueryData,
  useTranslation,
  useUser,
} from '@app/hooks';
import { LoadingIndicator, MessageCard } from '@app/components';
import { SocketContext, rs } from '@app/utils';
import { Pages } from '@app/constants';
import { MessageService } from '@app/api';
import type { MessageResponseProps } from '@app/types/redux/message';
import type { RootRouteProps } from '@app/types/navigation';
import { useNotify } from 'rn-notify';

type Props = {
  inputHeight: number;
};

const List = forwardRef<FlashList<MessageResponseProps>, Props>(
  ({ inputHeight }, ref) => {
    const { params } = useRoute<RootRouteProps<Pages.Chat_Details>>();
    const { socket } = SocketContext.useSocketContext();
    const { User } = useUser();
    const notify = useNotify();
    const { t } = useTranslation();
    const navigation = useAppNavigation();
    const { readAllMessages, removeConversation } = useConversation();
    const setMessagesData = useSetQueryData<MessageResponseProps[]>();

    const onError = useCallback(() => {
      removeConversation(params.conversationId);
      notify.error({
        message: t('screens.chatDetail.notFound'),
        duration: 5000,
      });
      navigation.goBack();
    }, []);
    const onSuccess = useCallback(() => {
      socket?.emit('messageDelivered', params.conversationId);
      readAllMessages(params.conversationId);
    }, [socket]);

    const {
      data,
      isLoading,
      status,
      refetch: allMessageRefetch,
    } = useQuery(
      [params.conversationId],
      () => MessageService.messages(params.conversationId),
      {
        onError,
        // refetchOnWindowFocus: 'always',
      },
    );
    const { refetch: readAllMessageRefetch } = useQuery(
      [params.conversationId, 'readAllMessages'],
      () =>
        MessageService.readAllMessages({
          conversationId: params.conversationId,
          receiverId: params.receiverId,
        }),
      {
        enabled: status === 'success',
        onSuccess,
      },
    );

    const renderItem = useCallback(
      ({ item }: { item: MessageResponseProps }) => {
        return (
          <MessageCard
            text={item.text}
            createdAt={item.createdAt}
            status={item.status}
            isRead={item.isRead}
            image={item?.image}
            isSender={User._id === item.sender}
          />
        );
      },
      [],
    );
    const keyExtractor = useCallback((item: MessageResponseProps) => {
      return item.uuid;
    }, []);
    const handleAddNewMessage = useCallback(
      (msg: MessageResponseProps) => {
        if (params?.conversationId === msg.conversationId) {
          setMessagesData([params?.conversationId], (prevData = []) => {
            return [msg, ...prevData];
          });
          socket?.emit('messageDelivered', params.conversationId);
          readAllMessages(params.conversationId);
        }
      },
      [socket],
    );
    const handleSeenMessage = useCallback(
      (conversationId: string) => {
        if (params?.conversationId === conversationId) {
          setMessagesData([params?.conversationId], (prevData = []) => {
            return _.map(prevData, (item) =>
              !item.isRead ? { ...item, isRead: true } : item,
            );
          });
          readAllMessages(params.conversationId);
        }
      },
      [socket],
    );

    useEffect(() => {
      if (socket) {
        socket.on('privateMessage', handleAddNewMessage);
        socket.on('messageSeen', handleSeenMessage);
        return () => {
          socket.off('privateMessage');
          socket.off('messageSeen');
        };
      }
    }, [socket]);

    useAppState({
      onForeground: () => {
        allMessageRefetch();
        readAllMessageRefetch();
      },
    });

    if (isLoading) return <LoadingIndicator />;

    return (
      <FlashList
        data={data}
        ref={ref}
        renderItem={renderItem}
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        keyExtractor={keyExtractor}
        inverted
        contentContainerStyle={{
          ...styles.contentContainer,
          paddingTop: inputHeight > 80 ? inputHeight : 80,
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={100}
      />
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: rs(24),
    paddingHorizontal: rs(24),
  },
});

export default memo(List);
