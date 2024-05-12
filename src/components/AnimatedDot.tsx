import React, { memo } from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Colors } from '@app/styles';
import { rs } from '@app/utils';

type Props = {
  inputRange: number[];
  offsetX: Animated.SharedValue<number>;
  avatarLength: number;
  index: number;
  outputRange: number[];
  height: number;
};

const _AnimatedDot = ({
  inputRange,
  offsetX,
  avatarLength,
  index,
  outputRange,
  height,
}: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      offsetX.value,
      inputRange,
      outputRange,
      Extrapolate.CLAMP,
    );

    const backgroundColor = interpolateColor(
      offsetX.value,
      inputRange,
      [Colors.grey300, Colors.primary500, Colors.grey300],
      'RGB',
    );

    return {
      width,
      backgroundColor,
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          height,
          backgroundColor: Colors.primary500,
          marginRight: avatarLength === index ? 0 : rs(8),
          borderRadius: 999,
        },
      ]}
    />
  );
};

export default memo(_AnimatedDot);
