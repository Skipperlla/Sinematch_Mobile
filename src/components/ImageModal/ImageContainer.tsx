import React from 'react';
import Animated, {
  Easing,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { clamp } from 'react-native-redash';

import { FastImage } from '@app/components';
import { ScreenSizes } from '@app/constants';

type Context = {
  scale: number;
};
type Props = {
  uri: string;
  backButtonOpacity: Animated.SharedValue<number>;
};
const DURATION = 250;

const ImageContainer = ({ uri, backButtonOpacity }: Props) => {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { translateX: -ScreenSizes.windowWidth / 2 },
        { translateY: -ScreenSizes.windowHeight / 2 },
        { scale: scale.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
        { translateX: ScreenSizes.windowWidth / 2 },
        { translateY: ScreenSizes.windowHeight / 2 },
      ],
      width: ScreenSizes.screenWidth,
      height: ScreenSizes.screenHeight,
    };
  });
  const onPinchGestureEvent = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    Context
  >({
    onStart: (_, ctx) => {
      ctx.scale = scale.value;
      backButtonOpacity.value = withTiming(0, {
        duration: DURATION,
        easing: Easing.out(Easing.ease),
      });
    },
    onFail: () => {
      backButtonOpacity.value = withTiming(1, {
        duration: DURATION,
        easing: Easing.out(Easing.ease),
      });
    },
    onActive: (event, ctx) => {
      scale.value = clamp(event.scale * ctx.scale, 1, 3);
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    },
    onEnd: () => {
      scale.value = withTiming(1);
      backButtonOpacity.value = withTiming(1, {
        duration: DURATION,
        easing: Easing.out(Easing.ease),
      });
    },
  });

  return (
    <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
      <Animated.View style={animatedImageStyle}>
        <FastImage uri={uri} width="100%" height="100%" resizeMode="contain" />
      </Animated.View>
    </PinchGestureHandler>
  );
};

export default ImageContainer;
