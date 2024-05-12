import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { memo, useCallback, useMemo, useState } from 'react';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute } from '@react-navigation/native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { snapPoint } from 'react-native-redash';

import { Pages, ScreenSizes } from '@app/constants';
import { useApp, useAppNavigation, useDiscovery } from '@app/hooks';
import { rs, swiperConfig } from '@app/utils';
import { FastImage } from '@app/components';
import { Colors } from '@app/styles';
import type { ImageProps } from '@app/types/redux/user';

import OverlayLabel from './OverlayLabel';
import Info from './Info';
import ImageSteps from './ImageSteps';
import ImageCarousel from './ImageCarousel';

type Props = {
  userId: string;
  swipeBack?: Animated.SharedValue<boolean>;
  currentUserId: Animated.SharedValue<string>;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  activeOffsetX?: number[];
  uri?: string;
  fullName: string;
  biography?: string;
  avatars?: ImageProps[];
  age: string;
  isSwipeBackScreen?: boolean;
};

const _SwipeCard = ({
  userId,
  swipeBack,
  onSwipeRight,
  onSwipeLeft,
  currentUserId,
  activeOffsetX,
  uri,
  fullName,
  age,
  biography,
  avatars,
  isSwipeBackScreen,
}: Props) => {
  const { isDarkMode } = useApp();
  const { isSwipeDisabled } = useDiscovery();
  const translateX = useSharedValue(0);
  const navigation = useAppNavigation();
  const route = useRoute();
  const currentRoute = route.name === Pages.Matches;
  const [isActive, setIsActive] = useState(false);
  const [avatarCurrentIndex, setAvatarCurrentIndex] = useState(0);

  const navigate = useCallback(
    () =>
      navigation.navigate(Pages.Profile_Detail, { userId, isSwipeBackScreen }),
    [userId, isSwipeBackScreen],
  );

  useDerivedValue(() => {
    runOnJS(setIsActive)(translateX.value !== 0);
  });
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      startX: number;
      startY: number;
    }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = event.translationX + ctx.startX;
    },
    onEnd: ({ velocityX }) => {
      if (swipeBack?.value) return;

      const destX = snapPoint(
        translateX.value,
        velocityX,
        swiperConfig.translateXRange,
      );

      if (!destX) swiperConfig.resetPosition(translateX);
      else
        swiperConfig.updatePosition(
          destX,
          translateX,
          velocityX,
          onSwipeRight,
          onSwipeLeft,
          route.name,
        );
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    const translationX = interpolate(
      translateX.value,
      swiperConfig.inputRotationRange,
      swiperConfig.outputRotationRange,
      Extrapolation.CLAMP,
    );
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          rotate: `${translationX}deg`,
        },
      ],
    };
  });
  const memoizedOverlayLabels = useMemo(() => {
    return swiperConfig.overlayLabel.map((label) => {
      return (
        <OverlayLabel
          key={label.direction}
          opacityValue={translateX}
          inputRange={label.inputRange}
          direction={label.direction}
          currentRoute={currentRoute}
        />
      );
    });
  }, []);

  useAnimatedReaction(
    () => {
      return swipeBack?.value && currentUserId.value === userId;
    },
    (value) => {
      if (value && swipeBack) {
        swipeBack.value = false;
        currentUserId.value = '';
        swiperConfig.resetPosition(translateX);
      }
    },
  );

  return (
    <PanGestureHandler
      activeOffsetX={activeOffsetX}
      onGestureEvent={onGestureEvent}
    >
      <Animated.View
        style={[
          currentRoute ? styles.likesCardContainer : styles.container,
          currentRoute
            ? undefined
            : {
                backgroundColor: isDarkMode ? Colors.dark2 : Colors.white,
              },
          animatedStyle,
        ]}
        pointerEvents={isSwipeDisabled ? 'none' : 'auto'}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={currentRoute ? styles.containerButton : { flex: 1 }}
          onPress={
            currentRoute ? (!isActive ? navigate : undefined) : undefined
          }
        >
          <Info
            fullName={fullName}
            age={age}
            biography={biography}
            isActive={isActive}
            navigate={navigate}
            currentRoute={currentRoute}
          />
          {currentRoute && uri ? (
            <FastImage uri={uri} width="100%" height={244} borderRadius={28} />
          ) : (
            <>
              <ImageSteps
                avatarCurrentIndex={avatarCurrentIndex}
                images={avatars ?? []}
              />
              <ImageCarousel
                images={avatars ?? []}
                avatarCurrentIndex={avatarCurrentIndex}
                isActive={isActive}
                setAvatarCurrentIndex={setAvatarCurrentIndex}
              />
            </>
          )}

          {memoizedOverlayLabels}
          <LinearGradient
            pointerEvents="none"
            colors={swiperConfig.baseGradientColor}
            style={[
              styles.linearGradient,
              {
                borderRadius: currentRoute ? 28 : 48,
              },
            ]}
            start={{ x: 0.5, y: 0.0 }}
            locations={[0.5781, 0.7719, 1]}
          />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 48,
  },
  likesCardContainer: {
    marginBottom: rs(20),
    width: ScreenSizes.screenWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradient: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  containerButton: {
    width: rs(180),
  },
});

export default memo(_SwipeCard);
