import { Alert, FlatList, Platform, StyleSheet, View } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  SequencedTransition,
} from 'react-native-reanimated';

import { SocketContext, rs } from '@app/utils';
import {
  ConversationCard,
  Icon,
  LoadingIndicator,
  Text,
} from '@app/components';
import {
  useApp,
  useConversation,
  useDiscovery,
  useUser,
  useTranslation,
  useAppState,
} from '@app/hooks';
import { ScreenSizes } from '@app/constants';
import { Colors } from '@app/styles';
import type { CreateConversationProps } from '@app/types/redux/conversation';

const DEFAULT_LIMIT = 10;

const Messages = () => {
  const {
    Conversation,
    endConversationAction,
    allConversationsAction,
    isLoading,
  } = useConversation();
  const { User } = useUser();
  const { deleteDiscoveryAction } = useDiscovery();
  const { isDarkMode } = useApp();
  const { socket } = SocketContext.useSocketContext();
  const { t } = useTranslation();
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [isRefresh, setIsRefresh] = useState(false);

  const onRemoveItem = useCallback(
    async (receiverId: string, conversationId: string, discoveryId: string) =>
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
      ),
    [],
  );

  const onEndReached = useCallback(() => {
    if (Conversation.count > limit) {
      setLimit((prev) => prev + DEFAULT_LIMIT);
      allConversationsAction(limit + DEFAULT_LIMIT);
    }
  }, [limit, Conversation.count]);
  const onRefresh = useCallback(() => {
    setIsRefresh(true);
    allConversationsAction(limit).then(() => setIsRefresh(false));
  }, [limit]);
  const renderItem = useCallback(
    ({ item }: { item: CreateConversationProps }) => {
      return (
        <ConversationCard
          uri={item.members[0]?.avatars[0]?.Location}
          fullName={item.members[0]?.fullName}
          receiverId={item.members[0]?.uuid}
          lastMessage={item?.lastMessage}
          onRemoveItem={() =>
            onRemoveItem(item.members[0]?.uuid, item.uuid, item.discoveryId)
          }
          createdAt={item.lastMessage?.createdAt}
          conversationId={item.uuid}
          isOwnerLastMessage={item.lastMessage?.sender === User?._id}
          isRead={item.lastMessage?.isRead}
          discoveryId={item.discoveryId}
        />
      );
    },
    [],
  );
  const keyExtractor = useCallback((item: CreateConversationProps) => {
    return item._id;
  }, []);
  const emptyMessages = useMemo(() => {
    return Conversation.conversations
      .filter((item) => {
        return item.lastMessage;
      })
      .sort((a, b) => {
        return (
          new Date(b.lastMessage?.createdAt).getTime() -
          new Date(a.lastMessage?.createdAt).getTime()
        );
      });
  }, [Conversation?.conversations]);
  const renderCell = React.useCallback(
    (props: JSX.Element) => (
      <Animated.View
        {...props}
        layout={SequencedTransition}
        entering={FadeIn}
        exiting={FadeOut}
      />
    ),
    [],
  );
  const ListEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Icon
          icon="bold_message"
          size={rs(75)}
          color={isDarkMode ? Colors.white : Colors.grey900}
        />
        <Text
          size="bodyLarge"
          fontFamily="bold"
          text="screens.chats.listEmptyTitle"
          align="center"
        />
        <Text
          size="bodyMedium"
          fontFamily="regular"
          align="center"
          color="grey500"
          text="screens.chats.listEmptyDescription"
        />
      </View>
    );
  }, []);
  const ListFooterComponent = useMemo(() => {
    return <LoadingIndicator style={styles.loadingIndicator} />;
  }, []);

  useAppState({
    onForeground: () => {
      allConversationsAction(limit);
    },
  });

  return (
    <FlatList
      data={emptyMessages}
      getItemLayout={(_, index) => ({
        length: 90,
        offset: 90 * index,
        index,
      })}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listStyle}
      keyExtractor={keyExtractor}
      CellRendererComponent={Platform.OS === 'ios' ? renderCell : undefined}
      scrollEventThrottle={16}
      ListEmptyComponent={ListEmptyComponent}
      onEndReachedThreshold={0.2}
      onEndReached={onEndReached}
      ListFooterComponent={
        isLoading && !isRefresh ? ListFooterComponent : undefined
      }
      windowSize={5}
      refreshing={isRefresh}
      onRefresh={onRefresh}
      maxToRenderPerBatch={5}
      initialNumToRender={5}
    />
  );
};

const styles = StyleSheet.create({
  listStyle: {
    paddingHorizontal: rs(24),
  },
  title: {
    marginBottom: rs(20),
    paddingHorizontal: rs(24),
  },
  avatar: {
    marginRight: rs(16),
  },
  line: {
    height: rs(1),
    marginVertical: rs(20),
    marginHorizontal: rs(24),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: rs(10),
    height: ScreenSizes.screenHeight * 0.7,
  },
  loadingIndicator: {
    marginBottom: rs(12),
  },
});

export default Messages;
