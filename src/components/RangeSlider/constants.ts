import Animated from 'react-native-reanimated';

import { ScreenSizes } from '@app/constants';
import { rs } from '@app/utils';

const sliderWidth = ScreenSizes.windowWidth - rs(36) * 2;
const knobWidth = 20;
const min = 18;
const max = 100;
const step = 1;
const indicatorHeight = 6;

function calculateValue(translateX: Animated.SharedValue<number>) {
  'worklet';
  return (
    min +
    Math.floor(translateX.value / (sliderWidth / ((max - min) / step))) * step
  );
}
function calculateTranslateX(value: number): number {
  return ((value - min) / step) * (sliderWidth / (max - min));
}

export {
  sliderWidth,
  knobWidth,
  min,
  max,
  step,
  indicatorHeight,
  calculateValue,
  calculateTranslateX,
};
