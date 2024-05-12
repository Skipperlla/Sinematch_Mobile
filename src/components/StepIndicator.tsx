import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  withDelay,
} from 'react-native-reanimated';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import Pages, { AccountSetupPages } from '@app/constants/pages';
import { useAccountSetup } from '@app/hooks';

const StepIndicator = () => {
  const { currentPage } = useAccountSetup();
  const route = useRoute();
  const defaultWidth = Math.ceil(
    (100 / AccountSetupPages.length) * currentPage,
  );
  const previousWidth = Math.ceil(
    (100 / AccountSetupPages.length) * (currentPage - 1),
  );

  const width = useSharedValue(previousWidth);

  const animatedStyle = useAnimatedStyle(() => {
    const percentageWidth = interpolate(
      width.value,
      [0, 100],
      [0, 100],
      Extrapolate.CLAMP,
    );
    return {
      width: `${percentageWidth}%`,
    };
  });

  useFocusEffect(
    useCallback(() => {
      width.value = withDelay(
        500,
        withSpring(defaultWidth, {
          damping: 20,
          stiffness: 100,
          mass: 1,
          overshootClamping: false,
          restDisplacementThreshold: 0.001,
          restSpeedThreshold: 0.001,
        }),
      );
    }, []),
  );

  return (
    <View
      style={{
        paddingHorizontal: route.name === Pages.Favorite ? rs(24) : 0,
        marginBottom: route.name === Pages.FullName ? rs(16) : 0,
      }}
    >
      <View style={style.indicatorContainer}>
        <Animated.View style={[style.indicator, animatedStyle]} />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  indicatorContainer: {
    height: rs(6),
    width: '100%',
    backgroundColor: Colors.primary100,
    borderRadius: rs(4),
    overflow: 'hidden',
  },
  indicator: {
    height: rs(6),
    zIndex: 2,
    backgroundColor: Colors.primary500,
    borderRadius: rs(4),
  },
});

export default memo(StepIndicator);
