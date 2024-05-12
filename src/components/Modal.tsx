import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

import { ScreenSizes } from '@app/constants';
import { Button, Text } from '@app/components';
import * as Icons from '@app/components/icons';
import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import { useApp } from '@app/hooks';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  subTitle: string;
};

const DURATION = 250;

const _Modal = ({ isVisible, onClose, title, subTitle }: Props) => {
  const { isDarkMode } = useApp();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(200);
  const [isRendered, setIsRendered] = useState<boolean>(isVisible);

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      opacity.value = withTiming(1, { duration: DURATION });
      translateY.value = withTiming(0, {
        duration: DURATION,
        easing: Easing.out(Easing.ease),
      });
    } else {
      opacity.value = withTiming(0, { duration: DURATION });
      translateY.value = withTiming(
        200,
        {
          duration: DURATION,
          easing: Easing.in(Easing.ease),
        },
        () => runOnJS(setIsRendered)(false),
      );
    }
  }, [isVisible, opacity, translateY, DURATION]);

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!isRendered) return null;

  return (
    <Animated.View style={[styles.container, backdropAnimatedStyle]}>
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      <Animated.View
        style={[
          styles.modalContent,
          {
            backgroundColor: isDarkMode ? Colors.dark2 : Colors.white,
          },
          contentAnimatedStyle,
        ]}
      >
        <Icons.ModalCheck />
        <View style={styles.textContainer}>
          <Text
            text={title}
            color="primary500"
            fontFamily="bold"
            align="center"
            size="h4"
            style={styles.title}
          />
          <Text
            text={subTitle}
            align="center"
            fontFamily="regular"
            size="bodyLarge"
            style={styles.subTitle}
          />
        </View>
        <Button text="Button" />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ScreenSizes.screenWidth,
    height: ScreenSizes.screenHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: rs(32),
  },
  modalContent: {
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: rs(40),
    paddingHorizontal: rs(32),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textContainer: { marginVertical: rs(32) },
  title: { marginBottom: rs(16) },
  subTitle: { letterSpacing: 0.2 },
});

export default memo(_Modal);
