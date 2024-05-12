import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import { Colors } from '@app/styles';
import { useApp } from '@app/hooks';

import Knob from './Knob';
import { indicatorHeight, calculateTranslateX, sliderWidth } from './constants';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export type SliderProps = {
  min: number;
  max: number;
};
type Props = {
  onValueChange: (value: SliderProps) => void;
  min: number;
  max: number;
  minDefaultValue: number;
  maxDefaultValue: number;
};

const Slider = ({
  onValueChange,
  min,
  max,
  minDefaultValue,
  maxDefaultValue,
}: Props) => {
  const { isDarkMode } = useApp();

  const minTranslateX = useSharedValue(calculateTranslateX(minDefaultValue));
  const maxTranslateX = useSharedValue(calculateTranslateX(maxDefaultValue));
  const minZIndex = useSharedValue(1);
  const maxZIndex = useSharedValue(1);

  const derivedWidth = useDerivedValue(() => {
    return maxTranslateX.value - minTranslateX.value;
  });
  const sliderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: minTranslateX.value,
        },
      ],
      width: derivedWidth.value,
    };
  });

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.sliderBack,
          {
            backgroundColor: isDarkMode ? Colors.dark3 : Colors.grey200,
          },
        ]}
      />

      <AnimatedLinearGradient
        colors={Colors.gradientPurple}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[sliderStyle, styles.sliderFront]}
      />

      <View>
        <Knob
          translateX={minTranslateX}
          minTranslateX={minTranslateX}
          maxTranslateX={maxTranslateX}
          isMin
          zIndex={minZIndex}
          minZIndex={minZIndex}
          maxZIndex={maxZIndex}
          onValueChange={onValueChange}
          defaultValue={minDefaultValue}
          min={min}
          max={max}
        />
        <Knob
          translateX={maxTranslateX}
          minTranslateX={minTranslateX}
          maxTranslateX={maxTranslateX}
          zIndex={maxZIndex}
          minZIndex={minZIndex}
          maxZIndex={maxZIndex}
          onValueChange={onValueChange}
          defaultValue={maxDefaultValue}
          min={min}
          max={max}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: sliderWidth,
  },
  sliderBack: {
    width: sliderWidth,
    height: indicatorHeight,
    borderRadius: 100,
  },
  sliderFront: {
    height: indicatorHeight,
    borderRadius: 100,
    position: 'absolute',
  },
});

export default Slider;
