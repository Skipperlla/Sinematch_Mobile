import { TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

import { Icon } from '@app/components';
import { Colors } from '@app/styles';
import { SocketContext, rs } from '@app/utils';
import { useApp, useAppNavigation } from '@app/hooks';
import { RootRouteProps } from '@app/types/navigation';
import { Pages } from '@app/constants';

import Users from './Users';
import ActionButtons from './ActionButtons';

const Matched = () => {
  const { isDarkMode } = useApp();
  const { bottom } = useSafeAreaInsets();
  const { params } = useRoute<RootRouteProps<Pages.Matched>>();
  const { socket } = SocketContext.useSocketContext();
  const navigation = useAppNavigation();

  useEffect(() => {
    if (socket) socket.emit('joinConversation', params.conversationId);
  }, [socket]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingBottom: bottom || 24,
        },
      ]}
    >
      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <Icon
          icon="light_outline_arrow_left"
          color={isDarkMode ? Colors.white : Colors.grey900}
          size={rs(32)}
        />
      </TouchableOpacity>
      <Users />
      <ActionButtons />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rs(24),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  backButton: {
    width: rs(48),
    height: rs(48),
    justifyContent: 'center',
  },
});

export default Matched;
