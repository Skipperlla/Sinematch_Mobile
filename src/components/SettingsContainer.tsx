import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React, { PropsWithChildren, memo } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { rs } from '@app/utils';
import { Icon, Text } from '@app/components';
import { useApp, useAppNavigation } from '@app/hooks';
import { Colors } from '@app/styles';

type Props = PropsWithChildren<{
  title: string;
}>;

const _SettingsContainer = ({ children, title }: Props) => {
  const { top, bottom } = useSafeAreaInsets();
  const { isDarkMode } = useApp();
  const navigation = useAppNavigation();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: bottom ? 0 : top,
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Icon
            icon="light_outline_arrow_left"
            size={rs(32)}
            color={isDarkMode ? Colors.white : Colors.grey900}
          />
        </TouchableOpacity>
        <Text fontFamily="bold" size="h4" text={title} />
      </View>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rs(24),
    gap: rs(28),
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(12),
  },
});

export default memo(_SettingsContainer);
