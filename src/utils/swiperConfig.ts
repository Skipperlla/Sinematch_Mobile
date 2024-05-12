import Animated, { runOnJS, withSpring } from 'react-native-reanimated';

import { Pages, ScreenSizes } from '@app/constants';
import type { OverlayLabelType } from '@app/types/redux/discovery';

const userConfig = {
  damping: 15,
  stiffness: 120,
  mass: 0.5,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
};
type OverlayLabelProps = OverlayLabelType;

function resetPosition(x: Animated.SharedValue<number>): void {
  'worklet';
  x.value = withSpring(0, userConfig);
}

function updatePosition(
  destX: number,
  translateX: Animated.SharedValue<number>,
  velocityX: number,
  onSwipedRight: () => void,
  onSwipedLeft: () => void,
  routeName: string,
) {
  'worklet';
  const swipeLeftCoord =
    routeName === Pages.Swipe_Back
      ? (-ScreenSizes.screenWidth - 50) * 2
      : -ScreenSizes.screenWidth - 50;
  if (Math.sign(destX) === 1) {
    runOnJS(onSwipedRight)();
    translateX.value = withSpring(ScreenSizes.screenWidth + 50, {
      velocity: velocityX,
    });
  } else if (Math.sign(destX) === -1) {
    runOnJS(onSwipedLeft)();
    translateX.value = withSpring(swipeLeftCoord, {
      velocity: velocityX,
    });
  } else resetPosition(translateX);
}

const translateXRange = [
  -ScreenSizes.windowWidth / 1.5,
  0,
  ScreenSizes.windowWidth / 1.5,
];

const inputRotationRange = [
  -ScreenSizes.windowWidth,
  0,
  ScreenSizes.windowWidth,
];
const outputRotationRange = [-12, 0, 12];

const overlayLabel: OverlayLabelProps[] = [
  {
    inputRange: [0, ScreenSizes.windowWidth / 2.5],
    direction: 'right',
  },
  {
    inputRange: [0, -ScreenSizes.windowWidth / 2.5],
    direction: 'left',
  },
];

const baseGradientColor = [
  'rgba(150, 16, 255, 0)',
  'rgba(150, 16, 255, 0.55)',
  '#9610FF',
];
const rightGradientColor = [
  'rgba(55, 219, 152, 0)',
  'rgba(55, 219, 152, 0.55)',
  'rgba(55, 219, 152, 1)',
];
const leftGradientColor = [
  'rgba(245, 67, 54, 0)',
  'rgba(245, 67, 54, 0.55)',
  '#F54336',
];

export default {
  resetPosition,
  updatePosition,
  userConfig,
  translateXRange,
  inputRotationRange,
  outputRotationRange,
  baseGradientColor,
  rightGradientColor,
  leftGradientColor,
  overlayLabel,
};
