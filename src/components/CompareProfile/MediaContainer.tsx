import { StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { useRoute } from '@react-navigation/native';

import { Pages, ScreenSizes } from '@app/constants';
import { Text } from '@app/components';
import { rs } from '@app/utils';
import type { CommonGenreProps } from '@app/types/redux/user';
import type { MediaProps } from '@app/types/redux/media';

import MediaForm from './MediaForm';
import GenrePercent from './GenrePercent';

type Props = {
  movie: MediaProps[][];
  series: MediaProps[][];
  genres: CommonGenreProps[];
  movieTitle: string;
  seriesTitle: string;
  genreTitle: string;
};

const _MediaContainer = ({
  movie,
  series,
  genres,
  movieTitle,
  seriesTitle,
  genreTitle,
}: Props) => {
  const key = String(Math.random() * (Math.floor(999) - Math.ceil(1)));
  const routeName = useRoute().name;

  return (
    <View key={key} style={styles.container}>
      {!movie?.length && !series?.length && Pages.My_Profile !== routeName && (
        <Text
          text="screens.compareProfile.noCommonData"
          size="bodyMedium"
          fontFamily="medium"
          align="center"
          style={styles.text}
        />
      )}

      {movie && <MediaForm data={movie} title={movieTitle} />}
      {series && <MediaForm data={series} title={seriesTitle} />}
      {genres && <GenrePercent title={genreTitle} data={genres} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ScreenSizes.screenWidth,
  },
  text: {
    marginVertical: rs(24),
  },
});

export default memo(_MediaContainer);
