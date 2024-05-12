import React, { memo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import { FastImage, Radio, Text } from '@app/components';
import { useApp, useMedia } from '@app/hooks';

type Props = {
  posterPath: string;
  title: string;
  mediaType: string;
  vote: number;
  genreIds: number[];
  id: number;
};

const _Favorite = ({
  posterPath,
  title,
  mediaType,
  vote,
  genreIds,
  id,
}: Props) => {
  const { SelectedFavorites, setFavorite } = useMedia();
  const { isDarkMode } = useApp();
  const checked = SelectedFavorites.some((item) => item.id === id);
  // const navigation = useAppNavigation();

  const onAdd = useCallback(
    () =>
      setFavorite({
        title,
        posterPath,
        mediaType,
        id,
        genreIds,
        vote,
      }),
    [id, mediaType],
  );

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? Colors.dark2 : Colors.white,
          borderColor: isDarkMode ? Colors.dark3 : Colors.grey200,
          opacity: mediaType === 'person' ? 0.5 : 1,
        },
      ]}
      disabled={mediaType === 'person'}
      activeOpacity={0.8}
      onPress={onAdd}
    >
      <FastImage uri={posterPath} width={60} height={60} borderRadius={7} />
      <View style={styles.textContainer}>
        <Text
          text={title}
          style={styles.letterSpacing}
          fontFamily="semiBold"
          size="bodyMedium"
          numberOfLines={3}
        />
        <View style={styles.subTitleContainer}>
          <Text
            text={`mediaTypes.${mediaType}`}
            style={styles.letterSpacing}
            fontFamily="regular"
            size="bodySmall"
            color={isDarkMode ? 'grey400' : 'grey600'}
          />
          <View
            style={[
              styles.dot,
              {
                backgroundColor: isDarkMode ? Colors.dark3 : Colors.grey200,
              },
            ]}
          />
          <Text
            text={`${vote}%`}
            style={styles.letterSpacing}
            fontFamily="bold"
            size="bodySmall"
            color={vote < 40 ? 'error' : vote < 70 ? 'warning' : 'success'}
          />
        </View>
      </View>
      <Radio
        checked={checked}
        width={20}
        height={20}
        ellipseSize={10}
        disabled
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 24,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: rs(78),
    paddingVertical: rs(12),
    paddingHorizontal: rs(16),
    marginBottom: rs(24),
  },
  letterSpacing: {
    letterSpacing: 0.2,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: rs(8),
  },
  subTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rs(4),
  },
  dot: {
    width: rs(6),
    height: rs(6),
    borderRadius: 999,
    marginHorizontal: rs(8),
  },
});

export default memo(_Favorite);
