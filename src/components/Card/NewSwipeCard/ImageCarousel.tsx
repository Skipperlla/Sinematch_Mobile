import React, { useCallback } from 'react';
import { NativeTouchEvent, TouchableOpacity, View } from 'react-native';

import { FastImage } from '@app/components/index';
import { useStyle } from '@app/hooks';
import { ScreenSizes } from '@app/constants';
import { rs } from '@app/utils';
import type { ImageProps } from '@app/types/redux/user';

type Props = {
  images: ImageProps[];
  avatarCurrentIndex: number;
  setAvatarCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isActive: boolean;
};
const halfScreenWidth = (ScreenSizes.windowWidth - rs(24 * 2)) / 2;

const ImageCarousel = ({
  images,
  setAvatarCurrentIndex,
  avatarCurrentIndex,
  isActive,
}: Props) => {
  const styles = useStyle(
    () => ({
      flex: 1,
      zIndex: -1,
    }),
    [],
  );
  const handleImageChange = useCallback(
    ({ nativeEvent }: { nativeEvent: NativeTouchEvent }) => {
      const direction = nativeEvent.pageX > halfScreenWidth ? 1 : -1;
      const newIndex = avatarCurrentIndex + direction;

      if (newIndex >= 0 && newIndex < images.length)
        setAvatarCurrentIndex(newIndex);
    },
    [avatarCurrentIndex],
  );

  return (
    <View pointerEvents="box-none" style={styles}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={!isActive ? handleImageChange : undefined}
      >
        <FastImage
          resizeMode="cover"
          uri={images?.[avatarCurrentIndex]?.Location}
          priority="high"
          width="100%"
          height="100%"
          borderRadius={48}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ImageCarousel;
