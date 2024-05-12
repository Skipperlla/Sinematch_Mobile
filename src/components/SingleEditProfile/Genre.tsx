import React, { memo, useCallback, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useNotify } from 'rn-notify';

import {
  useAppNavigation,
  useMedia,
  useUser,
  useTranslation,
} from '@app/hooks';
import { rs } from '@app/utils';
import { Button, InterestCard, LoadingIndicator } from '@app/components';
import type { GenreProps } from '@app/types/redux/media';

const _Genre = () => {
  const { removeGenreAction, addGenreAction, User, myProfileMediaAction } =
    useUser();
  const { Genres, isLoading, genresAction } = useMedia();
  const { t } = useTranslation();
  const navigation = useAppNavigation();
  const notify = useNotify();
  const [selectedGenres, setSelectedGenres] = useState<(string | GenreProps)[]>(
    User?.genres ?? [],
  );
  const [excludedGenres, setExcludedGenres] = useState<string[]>([]);

  const setGenre = useCallback((_id: string, selectedGenre: boolean) => {
    if (selectedGenre) {
      setExcludedGenres((prev) => [...prev, _id]);
      setSelectedGenres((prev) => prev.filter((item) => item !== _id));
    } else {
      setSelectedGenres((prev) => [...prev, _id]);
      setExcludedGenres((prev) => prev.filter((item) => item !== _id));
    }
  }, []);

  function onPress() {
    if (selectedGenres?.length < 5)
      return notify.error({
        message: t('screens.signUp.genre.minGenre'),
        duration: 3000,
      });
    else if (User?.genres?.length && excludedGenres?.length)
      return removeGenreAction(excludedGenres).then(() => {
        addGenreAction(selectedGenres).then(() => {
          myProfileMediaAction(String(User?.uuid));
          navigation.goBack();
        });
      });
    else if (selectedGenres?.length >= 5)
      return addGenreAction(selectedGenres).then(() => {
        myProfileMediaAction(String(User?.uuid));
        navigation.goBack();
      });
  }
  useEffect(() => {
    genresAction();
  }, []);

  return (
    <View style={styles.wrapper}>
      {!Genres?.length && isLoading ? (
        <LoadingIndicator />
      ) : (
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {Genres?.map((item) => {
              const isActive =
                selectedGenres?.filter((genre) => {
                  return genre === item._id;
                }).length > 0;
              return (
                <InterestCard
                  key={item._id}
                  text={item.name}
                  isActive={isActive}
                  onPress={() => setGenre(item._id, isActive)}
                />
              );
            })}
          </ScrollView>
        </View>
      )}
      <Button
        text="components.singleEditProfile.save"
        onPress={onPress}
        disabled={isLoading}
        isLoading={isLoading}
        shadow
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: rs(24),
  },
  container: {
    flex: 1,
    marginVertical: rs(15),
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default memo(_Genre);
