import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  interpolateColor,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenSizes } from '@app/constants';
import { rs } from '@app/utils';
import { Icon } from '@app/components';
import type { ImageProps } from '@app/types/redux/user';

import ImageContainer from './ImageContainer';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  avatars: ImageProps[];
  imageCurrentIndex: number;
  carouselRef: React.RefObject<FlatList<ImageProps>>;
};

const DURATION = 250;
const VIEWABILITY_CONFIG = {
  viewAreaCoveragePercentThreshold: 50,
};

const _Modal = ({
  isVisible,
  onClose,
  avatars,
  imageCurrentIndex,
  carouselRef,
}: Props) => {
  const { top } = useSafeAreaInsets();
  const [isRendered, setIsRendered] = useState<boolean>(isVisible);
  const [isHidden, setIsHidden] = useState<boolean>(!false);
  const translateY = useSharedValue(ScreenSizes.screenHeight);
  const backButtonOpacity = useSharedValue(0);

  const onCloseModal = useCallback(() => {
    setIsHidden(false);
    translateY.value = withTiming(
      ScreenSizes.screenHeight,
      {
        duration: DURATION,
        easing: Easing.out(Easing.ease),
      },
      () => {
        runOnJS(onClose)();
        runOnJS(setIsRendered)(false);
      },
    );
  }, []);
  const backdropAnimatedStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      Math.abs(translateY.value),
      [ScreenSizes.screenHeight, 0, ScreenSizes.screenHeight],
      ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)'],
      'RGB',
    );
    return {
      backgroundColor: bgColor,
    };
  });
  const backButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backButtonOpacity.value,
    };
  });
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onActive: ({ translationY }) => {
      translateY.value = translationY;
      if (translationY)
        backButtonOpacity.value = withTiming(0, {
          duration: DURATION,
          easing: Easing.out(Easing.ease),
        });
    },
    onEnd: ({ translationY }) => {
      if (
        Math.sign(translationY) === -1 &&
        translationY < -ScreenSizes.screenHeight / 3.5
      ) {
        translateY.value = withTiming(
          -ScreenSizes.screenHeight,
          {
            duration: DURATION,
            easing: Easing.out(Easing.ease),
          },
          () => {
            runOnJS(onClose)();
            runOnJS(setIsRendered)(false);
            translateY.value = ScreenSizes.screenHeight;
          },
        );
      } else if (translationY > ScreenSizes.screenHeight / 3.5) {
        translateY.value = withTiming(
          ScreenSizes.screenHeight,
          {
            duration: DURATION,
            easing: Easing.out(Easing.ease),
          },
          () => {
            runOnJS(onClose)();
            runOnJS(setIsRendered)(false);
            translateY.value = ScreenSizes.screenHeight;
          },
        );
      } else {
        translateY.value = withTiming(0, {
          duration: DURATION,
          easing: Easing.out(Easing.ease),
        });
        backButtonOpacity.value = withTiming(1, {
          duration: DURATION,
          easing: Easing.out(Easing.ease),
        });
      }
    },
  });
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length)
        carouselRef.current?.scrollToIndex({
          index: Number(viewableItems[0].index),
          animated: false,
        });
    },
    [],
  );
  const renderItem = useCallback(({ item }: { item: ImageProps }) => {
    return (
      <ImageContainer
        uri={item.Location}
        backButtonOpacity={backButtonOpacity}
      />
    );
  }, []);
  const keyExtractor = useCallback((item: ImageProps) => item.key, []);
  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig: VIEWABILITY_CONFIG, onViewableItemsChanged },
  ]);

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      setIsHidden(true);
      translateY.value = withTiming(
        0,
        {
          duration: DURATION,
          easing: Easing.out(Easing.ease),
        },
        () =>
          (backButtonOpacity.value = withTiming(1, {
            duration: DURATION,
            easing: Easing.out(Easing.ease),
          })),
      );
    }
  }, [isVisible]);

  if (!isRendered) return null;

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      activeOffsetX={[-20, 20]}
      activeOffsetY={[-20, 20]}
    >
      <Animated.View style={[styles.container, backdropAnimatedStyle]}>
        {isHidden && (
          <Animated.View
            style={[
              backButtonAnimatedStyle,
              styles.backButton,
              {
                paddingTop: Number(StatusBar.currentHeight) * 1.5 || top,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                onCloseModal();
              }}
            >
              <Icon icon="close_outline" size={rs(32)} color="white" />
            </TouchableOpacity>
          </Animated.View>
        )}
        <Animated.View style={contentAnimatedStyle}>
          <FlatList
            data={avatars}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            viewabilityConfigCallbackPairs={
              viewabilityConfigCallbackPairs.current
            }
            renderItem={renderItem}
            initialScrollIndex={imageCurrentIndex}
            getItemLayout={(_, index) => ({
              length: ScreenSizes.screenWidth,
              offset: ScreenSizes.screenWidth * index,
              index,
            })}
            style={styles.flatListStyle}
            keyExtractor={keyExtractor}
          />
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ScreenSizes.screenWidth,
    height: ScreenSizes.screenHeight,
    ...StyleSheet.absoluteFillObject,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  textContainer: { marginVertical: rs(32) },
  title: { marginBottom: rs(16) },
  subTitle: { letterSpacing: 0.2 },
  flatListStyle: {
    width: ScreenSizes.screenWidth,
    height: ScreenSizes.screenHeight,
  },
  backButton: {
    zIndex: 1,
    position: 'absolute',
    right: rs(12),
  },
});

export default memo(_Modal);
