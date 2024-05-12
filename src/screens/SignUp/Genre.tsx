import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useNotify } from 'rn-notify';

import { useAccountSetup, useMedia, useUser, useTranslation } from '@app/hooks';
import { rs } from '@app/utils';
import { InterestCard, LoadingIndicator } from '@app/components';
import type { GenreProps } from '@app/types/redux/media';

import Layout from './Layout';

const Genre = () => {
  const { removeGenreAction, addGenreAction, User } = useUser();
  const { Genres, isLoading, genresAction } = useMedia();
  const { nextPage } = useAccountSetup();
  const { t } = useTranslation();
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
    if (User?.genres?.length && excludedGenres?.length)
      return removeGenreAction(excludedGenres).then(() => {
        addGenreAction(selectedGenres).then(nextPage);
      });
    else if (selectedGenres?.length >= 5)
      return addGenreAction(selectedGenres).then(nextPage);
    notify.error({
      message: t('screens.signUp.genre.minGenre'),
      duration: 3000,
    });
  }
  useEffect(() => {
    genresAction();
  }, []);

  return (
    <Layout
      title="screens.signUp.genre.title"
      description="screens.signUp.genre.description"
      onPress={onPress}
      isDisabled={!selectedGenres?.length}
    >
      {!Genres?.length && isLoading ? (
        <LoadingIndicator />
      ) : (
        <View style={style.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={style.contentContainer}
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
    </Layout>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: rs(15),
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default Genre;
