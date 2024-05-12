import { Colors } from '@app/styles';
import React, { memo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const SIZE = 86;
const duration = 2000;

type Props = {
  index: number;
};

const Ring = ({ index }: Props) => {
  const opacity = useSharedValue(0.7);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });
  useEffect(() => {
    opacity.value = withDelay(
      index * 400,
      withRepeat(withTiming(0, { duration }), -1, false),
    );
    scale.value = withDelay(
      index * 400,
      withRepeat(withTiming(4, { duration }), -1, false),
    );
  }, []);
  return <Animated.View style={[styles.container, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: Colors.deepPurple,
    position: 'absolute',
  },
});

export default memo(Ring);
