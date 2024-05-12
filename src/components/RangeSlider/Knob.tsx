import { View, StyleSheet, TextInput } from 'react-native';
import React from 'react';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';

import { Colors, Fonts, Sizes } from '@app/styles';
import * as Icons from '@app/components/icons';

import {
  indicatorHeight,
  knobWidth,
  sliderWidth,
  calculateValue,
  step,
} from './constants';
import type { SliderProps } from './Index';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type Props = {
  onValueChange: (value: SliderProps) => void;
  translateX: Animated.SharedValue<number>;
  minTranslateX: Animated.SharedValue<number>;
  maxTranslateX: Animated.SharedValue<number>;
  isMin?: boolean;
  minZIndex: Animated.SharedValue<number>;
  maxZIndex: Animated.SharedValue<number>;
  zIndex: Animated.SharedValue<number>;
  defaultValue: number;
  min: number;
  max: number;
};

const Knob = ({
  translateX,
  minTranslateX,
  maxTranslateX,
  isMin,
  onValueChange,
  minZIndex,
  maxZIndex,
  zIndex,
  defaultValue,
  min,
  max,
}: Props) => {
  const labelSpringyX = useDerivedValue<number>(() => {
    return withSpring(translateX.value);
  });
  const labelAngle = useDerivedValue<number>(() => {
    return (
      90 +
      (Math.atan2(-indicatorHeight, labelSpringyX.value - translateX.value) *
        180) /
        Math.PI
    );
  });

  const labelStyle = useAnimatedStyle(() => {
    const rotate = labelAngle.value;
    return {
      transform: [
        { translateX: labelSpringyX.value },
        { rotate: `${rotate}deg` },
      ],
      zIndex: zIndex.value,
    };
  });
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: knobWidth,
      zIndex: zIndex.value,
    };
  });

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      const nextValue = ctx.startX + event.translationX;

      if (isMin) {
        if (nextValue < 0) {
          translateX.value = 0;
        } else if (nextValue > maxTranslateX.value) {
          translateX.value = maxTranslateX.value;
          minZIndex.value = 2;
          maxZIndex.value = 1;
        } else {
          translateX.value = nextValue;
        }
      } else {
        if (nextValue > sliderWidth) {
          translateX.value = sliderWidth;
        } else if (nextValue < minTranslateX.value) {
          translateX.value = minTranslateX.value;
          minZIndex.value = 1;
          maxZIndex.value = 2;
        } else {
          translateX.value = nextValue;
        }
      }
    },
    onEnd: () => {
      const totalValue = {
        min: calculateValue(minTranslateX),
        max: calculateValue(maxTranslateX),
      };
      runOnJS(onValueChange)(totalValue);
    },
  });

  const minLabelText = useAnimatedProps(() => {
    //TODO: fix this later, when all problems are solved
    return {
      text: String(
        min +
          Math.floor(translateX.value / (sliderWidth / ((max - min) / step))) *
            step,
      ),
    } as any;
  });

  return (
    <>
      <Animated.View style={[styles.label, labelStyle]}>
        <AnimatedTextInput
          style={styles.labelText}
          animatedProps={minLabelText}
          editable={false}
          defaultValue={String(defaultValue)}
        />
        <Icons.SliderVector />
      </Animated.View>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <AnimatedLinearGradient
          colors={Colors.gradientPurple}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.container, rStyle]}
        >
          <View style={styles.dot} />
        </AnimatedLinearGradient>
      </PanGestureHandler>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: -15,
    left: -5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    bottom: 20,
    left: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    zIndex: 1,
    position: 'absolute',
    fontSize: Sizes.bodySmall,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: 'white',
  },
});

export default Knob;
