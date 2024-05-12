import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { forwardRef, memo, useCallback } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { FastImage, AnimatedDot } from '@app/components';
import { ScreenSizes } from '@app/constants';
import type { ImageProps } from '@app/types/redux/user';

type Props = {
  onShowModal: (index: number) => void;
  avatars: ImageProps[];
};

const SCREEN_SIZE = ScreenSizes.screenWidth;

const _Carousel = forwardRef<FlatList<ImageProps>, Props>(
  ({ onShowModal, avatars }, ref) => {
    const offsetX = useSharedValue(0);

    const renderItem = useCallback(
      ({ item, index }: { item: ImageProps; index: number }) => {
        return (
          <TouchableOpacity
            onPress={() => onShowModal(index)}
            activeOpacity={1}
            style={{
              zIndex: 10,
            }}
          >
            <FastImage
              uri={item.Location}
              width={ScreenSizes.screenWidth}
              height={ScreenSizes.windowHeight * 0.7}
              useRS={false}
            />
          </TouchableOpacity>
        );
      },
      [],
    );
    const keyExtractor = useCallback((item: ImageProps) => item.key, []);

    return (
      <View>
        <FlatList
          ref={ref}
          onScroll={({ nativeEvent }) =>
            (offsetX.value = nativeEvent.contentOffset.x)
          }
          data={avatars}
          pagingEnabled
          style={styles.list}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          scrollEventThrottle={16}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
        <View style={styles.dotContainer}>
          {avatars?.map((item, index) => {
            const inputRange = [
              (index - 1) * SCREEN_SIZE,
              index * SCREEN_SIZE,
              (index + 1) * SCREEN_SIZE,
            ];
            const outputRange = [6, 16, 6];

            return (
              <AnimatedDot
                key={item.key}
                height={6}
                index={index}
                offsetX={offsetX}
                avatarLength={Number(avatars?.length ?? []) - 1}
                inputRange={inputRange}
                outputRange={outputRange}
              />
            );
          })}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  dotContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: ScreenSizes.screenWidth,
  },
  list: {
    height: ScreenSizes.windowHeight * 0.7,
    width: ScreenSizes.screenWidth,
  },
});

export default memo(_Carousel);
