import React, { forwardRef, memo, useCallback, useEffect } from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useNotify } from 'rn-notify';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { StyleSheet } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { useRoute } from '@react-navigation/native';
import _ from 'lodash';

import { MessageService } from '@app/api';
import { LoadingIndicator, MessageCard } from '@app/components';
import { Pages } from '@app/constants';
import {
  useAppNavigation,
  useAppState,
  useConversation,
  useSetQueryData,
  useTranslation,
  useUser,
} from '@app/hooks';
import { SocketContext, rs } from '@app/utils';
import type { RootRouteProps } from '@app/types/navigation';
import type { MessageResponseProps } from '@app/types/redux/message';

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList,
) as typeof FlashList;

type Props = {
  inputHeight: number;
};

const AndroidList = forwardRef<FlashList<MessageResponseProps>, Props>(
  ({ inputHeight }, ref) => {
    const { height } = useReanimatedKeyboardAnimation();
    const { params } = useRoute<RootRouteProps<Pages.Chat_Details>>();
    const { User } = useUser();
    const { socket } = SocketContext.useSocketContext();
    const { readAllMessages } = useConversation();
    const { t } = useTranslation();
    const notify = useNotify();
    const navigation = useAppNavigation();
    const setMessagesData = useSetQueryData<MessageResponseProps[]>();

    const onError = useCallback(() => {
      notify.error({
        message: t('screens.chatDetail.notFound'),
        duration: 5000,
      });
      navigation.goBack();
    }, []);
    const onSuccess = useCallback(() => {
      socket?.emit('messageDelivered', params.conversationId);
      readAllMessages(params.conversationId);
    }, []);

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
        refetchOnWindowFocus: 'always',
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
        refetchOnWindowFocus: 'always',
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
    const handleAddNewMessage = useCallback((msg: MessageResponseProps) => {
      if (params?.conversationId === msg.conversationId) {
        setMessagesData([params?.conversationId], (prevData = []) => {
          return [msg, ...prevData];
        });
        socket?.emit('messageDelivered', params.conversationId);
        readAllMessages(params.conversationId);
      }
    }, []);
    const handleSeenMessage = useCallback((conversationId: string) => {
      if (params?.conversationId === conversationId) {
        setMessagesData([params?.conversationId], (prevData = []) => {
          return _.map(prevData, (item) =>
            !item.isRead ? { ...item, isRead: true } : item,
          );
        });
        readAllMessages(params.conversationId);
      }
    }, []);
    const scrollViewStyle = useAnimatedStyle(
      () => ({
        transform: [{ translateY: height.value }, ...styles.inverted.transform],
      }),
      [],
    );

    const fakeView = useAnimatedStyle(
      () => ({
        height: Math.abs(height.value),
      }),
      [],
    );
    const ListFooterComponent = useCallback(() => {
      return <Animated.View style={fakeView} />;
    }, []);

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
      <AnimatedFlashList
        data={data}
        ref={ref}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={scrollViewStyle}
        ListFooterComponent={ListFooterComponent}
        inverted
        contentContainerStyle={{
          ...styles.contentContainer,
          paddingTop: inputHeight > 80 ? inputHeight : 80,
        }}
        scrollEventThrottle={16}
        estimatedItemSize={100}
        showsVerticalScrollIndicator={false}
      />
    );
  },
);

const styles = StyleSheet.create({
  inverted: {
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },

  contentContainer: {
    paddingHorizontal: rs(24),
    paddingBottom: rs(24),
  },
});

export default memo(AndroidList);
