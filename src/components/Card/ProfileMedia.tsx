import { View, StyleSheet } from 'react-native';
import React, { memo } from 'react';

import { ScreenSizes } from '@app/constants';
import { rs } from '@app/utils';
import { FastImage, Text } from '@app/components';

const IMAGE_SIZE = (ScreenSizes.screenWidth - rs(32 * 2)) / 3.5;

type Props = {
  index: number;
  posterPath: string;
  title: string;
};

const _ProfileMediaCard = ({ index, posterPath, title }: Props) => {
  return (
    <View
      style={[
        styles.container,
        {
          //* Only for the middle item
          marginHorizontal: index === 1 || index === 4 ? rs(12) : 0,
        },
      ]}
    >
      <FastImage
        uri={posterPath}
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        borderRadius={12}
        priority="high"
      />
      <Text
        text={title}
        fontFamily="medium"
        size="bodySmall"
        align="center"
        numberOfLines={1}
        style={styles.title}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: rs(12),
    width: (ScreenSizes.screenWidth - rs(32 * 2)) / 3,
    height: ScreenSizes.screenWidth * 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    paddingVertical: rs(8),
    width: '100%',
  },
});

export default memo(_ProfileMediaCard);
