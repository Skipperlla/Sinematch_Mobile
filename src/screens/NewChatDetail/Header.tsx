import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useQuery } from '@tanstack/react-query';

import { useApp, useAppNavigation, useConversation, useUser } from '@app/hooks';
import { Icon, LoadingBubble, Text } from '@app/components';
import { SocketContext, rs } from '@app/utils';
import { Pages } from '@app/constants';
import { Colors } from '@app/styles';
import { MessageService } from '@app/api';
import type { RootRouteProps } from '@app/types/navigation';

type Props = {
  onShowDetails: () => void;
};

const Header = ({ onShowDetails }: Props) => {
  const { isDarkMode } = useApp();
  const { User } = useUser();
  const { Conversation } = useConversation();
  const { params } = useRoute<RootRouteProps<Pages.Chat_Details>>();
  const { top } = useSafeAreaInsets();
  const { socket } = SocketContext.useSocketContext();
  const [isWrite, setIsWrite] = useState(false);
  const navigation = useAppNavigation();
  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight(frame, false, insets.top);
  const unReadMessages = Conversation?.conversations?.filter(
    (conversation) =>
      conversation.uuid !== params.conversationId &&
      conversation?.lastMessage?.isRead === false &&
      conversation?.lastMessage?.sender !== User?._id,
  )?.length;

  const { status } = useQuery(
    [params.conversationId],
    () => MessageService.messages(params.conversationId),
    {
      enabled: false,
    },
  );

  useEffect(() => {
    if (socket) {
      socket.on(
        'usersWhoWrote',
        ({
          isTyping,
          conversationId,
        }: {
          isTyping: boolean;
          conversationId: string;
        }) => {
          if (conversationId === params.conversationId) {
            if (isTyping) setIsWrite(isTyping);
            else setIsWrite(isTyping);
          }
        },
      );
    }
  }, [status]);

  return (
    <View
      style={[
        {
          height: headerHeight,
          backgroundColor: isDarkMode ? Colors.dark1 : Colors.white,
          paddingTop: top,
        },
        styles.container,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: rs(8),
        }}
      >
        <TouchableOpacity onPress={navigation.goBack}>
          <Icon
            icon="light_outline_arrow_left"
            size={rs(32)}
            color={isDarkMode ? Colors.white : Colors.grey900}
          />
        </TouchableOpacity>
        {unReadMessages > 0 && (
          <Text
            size="bodyLarge"
            fontFamily="medium"
            text={String(unReadMessages)}
          />
        )}
      </View>
      {isWrite ? (
        <View style={styles.bubbleContainer}>
          <LoadingBubble size={6} color={Colors.primary400} />
          <Text
            size="bodySmall"
            fontFamily="semiBold"
            color="primary500"
            text="screens.chatDetail.typing"
          />
        </View>
      ) : (
        <Text
          size="h6"
          fontFamily="bold"
          color={isDarkMode ? 'white' : 'grey900'}
          text={params.receiverFullName}
          numberOfLines={1}
          style={styles.fullNameText}
          align="center"
        />
      )}
      <TouchableOpacity onPress={onShowDetails} disabled={status !== 'success'}>
        <Icon
          icon="light_more_circle"
          size={rs(32)}
          color={isDarkMode ? Colors.white : Colors.grey900}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: rs(12),
  },
  bubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(8),
  },
  fullNameText: {
    flex: 1,
    paddingHorizontal: rs(12),
  },
});

export default memo(Header);
