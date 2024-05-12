import { View, StyleSheet } from 'react-native';
import React, { memo } from 'react';
import LinearGradient from 'react-native-linear-gradient';

import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import { ScreenSizes } from '@app/constants';
import type { ImageProps } from '@app/types/redux/user';

type Props = {
  avatarCurrentIndex: number;
  images: ImageProps[];
};

const ImageSteps = ({ avatarCurrentIndex, images }: Props) => {
  const progressWidth =
    (ScreenSizes.screenWidth - rs(24 * 4)) / images?.length - 8;

  return (
    <View style={style.wrapper}>
      {images?.map((_, index) => {
        return (
          <LinearGradient
            key={index}
            colors={
              avatarCurrentIndex === index
                ? Colors.gradientPurple
                : [Colors.white, Colors.white]
            }
            locations={[0.5781, 0.7719]}
            style={[
              style.stepIndicator,
              {
                width: progressWidth,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const style = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    paddingHorizontal: rs(24),
    paddingTop: rs(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepIndicator: {
    height: rs(3),
    borderRadius: 999,
  },
});

export default memo(ImageSteps);
