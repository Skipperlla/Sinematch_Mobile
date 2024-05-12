import { FlatList, Platform, StyleSheet, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  SequencedTransition,
} from 'react-native-reanimated';

import { rs } from '@app/utils';
import { NewMatchCard, Text } from '@app/components';
import { useApp, useConversation } from '@app/hooks';
import { Colors } from '@app/styles';
import type { CreateConversationProps } from '@app/types/redux/conversation';

const NewMatches = () => {
  const { Conversation } = useConversation();
  const { isDarkMode } = useApp();

  const renderItem = useCallback(
    ({ item }: { item: CreateConversationProps }) => {
      return (
        <NewMatchCard
          receiverId={item.members[0]?.uuid}
          conversationId={item.uuid}
          avatar={item.members[0]?.avatars[0]?.Location}
          fullName={item.members[0]?.fullName}
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
        return !item.lastMessage;
      })
      .sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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

  return (
    <View>
      {emptyMessages?.length > 0 && (
        <>
          <Text
            fontFamily="bold"
            size="h5"
            text="screens.chats.newMatches"
            style={styles.title}
          />
          <FlatList
            data={emptyMessages}
            horizontal
            getItemLayout={(_, index) => ({
              length: rs(80),
              offset: rs(80) * index,
              index,
            })}
            CellRendererComponent={
              Platform.OS === 'ios' ? renderCell : undefined
            }
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={keyExtractor}
            scrollEventThrottle={16}
          />
          <View
            style={[
              styles.line,
              {
                backgroundColor: isDarkMode ? Colors.dark3 : Colors.grey200,
              },
            ]}
          />
        </>
      )}
    </View>
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
});

export default NewMatches;
