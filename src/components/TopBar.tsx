import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import React, { PropsWithChildren, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { lib, rs } from '@app/utils';
import { FastImage, Text } from '@app/components';
import { useApp, useAppNavigation, useUser } from '@app/hooks';
import { Pages } from '@app/constants';

const _TopBar = ({ children }: PropsWithChildren) => {
  const { User } = useUser();
  const { isDarkMode } = useApp();
  const { top } = useSafeAreaInsets();
  const navigation = useAppNavigation();

  const navigate = useCallback(() => navigation.navigate(Pages.My_Profile), []);

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingTop: Platform.OS === 'ios' ? top : top + 15,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={navigate}
      >
        <FastImage
          uri={String(User?.avatars?.[0]?.Location)}
          width={48}
          height={48}
          borderRadius={999}
        />
        <View style={styles.textContainer}>
          <Text
            text={lib.getGreeting()}
            fontFamily="regular"
            size="bodyLarge"
            color={isDarkMode ? 'grey300' : 'grey600'}
            letterSpacing={0.2}
          />
          <Text
            text={String(User?.fullName)}
            fontFamily="bold"
            size="h5"
            letterSpacing={0.2}
          />
        </View>
      </TouchableOpacity>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: rs(24),
    marginHorizontal: rs(24),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  textContainer: {
    flex: 1,
    marginLeft: rs(16),
    gap: rs(2),
  },
});

export default _TopBar;
