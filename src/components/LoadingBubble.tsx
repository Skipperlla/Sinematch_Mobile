import React, { memo, useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@app/styles';
import { rs } from '@app/utils';

type DotProps = {
  index: number;
  color: string;
  size: number;
};
type BubbleProps = {
  color?: string;
  size: number;
  style?: ViewStyle;
};

const Dot = ({ index, color, size }: DotProps) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      index * 100,
      withRepeat(
        withSequence(
          withTiming(-3, { duration: 500 }),
          withTiming(3, { duration: 500 }),
        ),
        -1,
        true,
      ),
    );
  }, [index, translateY]);

  const dotStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        dotStyle,
        styles.dot,
        {
          backgroundColor: color,
          width: size,
          height: size,
        },
      ]}
    />
  );
};

const _LoadingBubble = ({
  color = Colors.primary400,
  size,
  style,
}: BubbleProps) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Dot key={index} index={index} color={color} size={size} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: rs(6),
  },
  dot: {
    borderRadius: 99,
  },
});

export default memo(_LoadingBubble);
