import { StyleSheet, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';

import { ScreenSizes } from '@app/constants';
import { rs } from '@app/utils';
import { ProfileMediaCard } from '@app/components';
import type { MediaProps } from '@app/types/redux/media';

type Props = {
  data: MediaProps[];
};

const _List = ({ data }: Props) => {
  const renderItem = useCallback(
    ({ item, index }: { item: MediaProps; index: number }) => {
      return (
        <ProfileMediaCard
          index={index}
          posterPath={item.posterPath}
          title={item.title}
        />
      );
    },
    [],
  );
  const keyExtractor = useCallback((item: MediaProps) => String(item.id), []);

  return (
    <View
      style={[
        styles.container,
        {
          height:
            data?.length > 3
              ? ScreenSizes.screenWidth * 0.4 * 2
              : ScreenSizes.screenWidth * 0.2 * 2,
        },
      ]}
    >
      <FlashList
        data={data}
        bounces={false}
        numColumns={3}
        pagingEnabled
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={(ScreenSizes.screenWidth - rs(32 * 2)) / 3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ScreenSizes.screenWidth,
  },
  contentContainer: {
    paddingHorizontal: rs(24),
  },
});

export default memo(_List);
