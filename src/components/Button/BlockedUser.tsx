import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { FastImage, Text } from '@app/components';
import { Colors } from '@app/styles';
import { lib, rs } from '@app/utils';
import { useTranslation } from '@app/hooks';

type Props = {
  uri: string;
  fullName: string;
  userName: string;
  onBlockUser: () => void;
};

const _BlockedUser = ({ uri, fullName, userName, onBlockUser }: Props) => {
  const scale = useSharedValue(1);
  const { t } = useTranslation();

  const onPressOut = useCallback(
    () => (scale.value = withSpring(1, lib.springConfig(25, 150))),
    [],
  );
  const onOpenAlert = useCallback(() => {
    scale.value = withSpring(0.9, lib.springConfig(10, 200));
    Alert.alert(
      String(t('components.button.blockedUsers.unBlock')),
      String(t('components.button.blockedUsers.description')),
      [
        {
          text: String(t('components.button.blockedUsers.no')),
          style: 'cancel',
        },
        {
          text: String(t('components.button.blockedUsers.yes')),
          style: 'destructive',
          onPress: onBlockUser,
        },
      ],
    );
    const timer = setTimeout(onPressOut, 200);
    return () => clearTimeout(timer);
  }, []);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={onOpenAlert}
      >
        <FastImage uri={uri} width={50} height={50} borderRadius={999} />
        <View style={styles.textContainer}>
          <Text fontFamily="bold" size="bodyLarge" text={fullName} />
          <Text fontFamily="medium" size="bodyMedium" text={`@${userName}`} />
        </View>
        <TouchableOpacity style={styles.button} disabled>
          <Text
            fontFamily="bold"
            size="bodyMedium"
            text="components.button.blockedUsers.unBlock"
            color="white"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: rs(16),
    borderRadius: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(16),
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: rs(4),
    flex: 1,
  },
  button: {
    backgroundColor: Colors.primary500,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
});

export default memo(_BlockedUser);
