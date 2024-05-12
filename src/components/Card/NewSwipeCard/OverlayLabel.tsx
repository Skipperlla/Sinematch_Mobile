import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Icon, Text } from '@app/components';
import { Colors } from '@app/styles';
import * as Icons from '@app/components/icons';
import { rs, swiperConfig } from '@app/utils';
import type { OverlayLabelType } from '@app/types/redux/discovery';

type Props = {
  opacityValue: Animated.SharedValue<number>;
  currentRoute: boolean;
} & OverlayLabelType;

const _OverlayLabel = ({
  opacityValue,
  inputRange,
  direction,
  currentRoute,
}: Props) => {
  const iconSize = currentRoute ? rs(26) : rs(56);
  const buttonSize = currentRoute ? rs(45) : rs(80);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        opacityValue.value,
        inputRange,
        [0, 1],
        Extrapolation.CLAMP,
      ),
      justifyContent: 'center',
      zIndex: 1,
      alignItems: 'center',
      ...StyleSheet.absoluteFillObject,
    };
  });
  const renderColor = useMemo(() => {
    switch (direction) {
      case 'right':
        return swiperConfig.rightGradientColor;
      case 'left':
        return swiperConfig.leftGradientColor;
      default:
        return [];
    }
  }, []);
  const renderIcon = useMemo(() => {
    switch (direction) {
      case 'right':
        return <Icons.GradientHeart width={iconSize} height={iconSize} />;
      case 'left':
        return (
          <Icon icon="close_outline" color={Colors.red} size={iconSize + 10} />
        );
      default:
        return <Icons.Star width={iconSize} height={iconSize} />;
    }
  }, []);

  const renderText = useMemo(() => {
    switch (direction) {
      case 'right':
        return (
          <Text
            text="components.card.likesSwipeCard.like"
            size="bodyLarge"
            color="green"
            fontFamily="bold"
            style={[styles.labelText, styles.leftPosition]}
          />
        );
      case 'left':
        return (
          <Text
            text="components.card.likesSwipeCard.dislike"
            size="bodyLarge"
            color="red"
            fontFamily="bold"
            style={[styles.labelText, styles.rightPosition]}
          />
        );
      default:
        return null;
    }
  }, []);
  return (
    <Animated.View style={animatedStyle} pointerEvents="none">
      <View
        style={[
          styles.iconContainer,
          {
            width: buttonSize,
            height: buttonSize,
          },
        ]}
      >
        {renderIcon}
      </View>
      {currentRoute && renderText}
      <LinearGradient
        pointerEvents="none"
        colors={renderColor}
        style={[
          styles.gradient,
          {
            borderRadius: currentRoute ? 28 : 48,
          },
        ]}
        start={{ x: 0.5, y: 0.0 }}
        locations={[0.5781, 0.7719, 1]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 100,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  labelText: {
    top: 20,
    position: 'absolute',
  },
  leftPosition: {
    left: 20,
  },
  rightPosition: {
    right: 20,
  },
});

export default _OverlayLabel;
