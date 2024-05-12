import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';

import { Button, LoadingIndicator } from '@app/components';
import { useAppNavigation, useMedia, useUser } from '@app/hooks';
import { rs } from '@app/utils';
import type { MediaProps } from '@app/types/redux/media';

import List from './List';
import Search from './Search';
import MediaTypes from './MediaTypes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type FilterProps = {
  query: string;
  page?: number;
  mediaType?: string;
};
export type FlashListRef = FlashList<MediaProps> | null;

const Favorite = () => {
  const {
    SelectedFavorites,
    isLoading,
    ExcludedFavorites,
    popularMediasAction,
    isSearching,
  } = useMedia();
  const { MultiSearch, multipleSetFavorite } = useMedia();
  const { bottom } = useSafeAreaInsets();
  const {
    addFavoriteAction,
    removeFavoriteAction,
    User,
    myProfileMediaAction,
  } = useUser();
  const navigation = useAppNavigation();
  const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterProps>({
    query: '',
    page: 1,
    mediaType: undefined,
  });
  const flashListRef = useRef<FlashList<MediaProps>>(null);
  const isLoadingCondition = MultiSearch?.results?.length
    ? isSearching
    : isFirstLoading || isLoading || isSearching;
  console.log(User.favMovies);
  const onPress = useCallback(() => {
    if (
      (User?.favMovies?.length || User?.favSeries?.length) &&
      ExcludedFavorites?.length
    )
      return removeFavoriteAction(ExcludedFavorites).then(() => {
        return addFavoriteAction(SelectedFavorites).then(() => {
          myProfileMediaAction(String(User?.uuid));
          navigation.goBack();
        });
      });
    else if (SelectedFavorites?.length)
      return addFavoriteAction(SelectedFavorites).then(() => {
        myProfileMediaAction(String(User?.uuid));
        navigation.goBack();
      });
  }, [
    ExcludedFavorites,
    SelectedFavorites,
    User?.favMovies?.length,
    User?.favSeries?.length,
  ]);

  useEffect(() => {
    popularMediasAction(undefined).then(() => setIsFirstLoading(false));
    multipleSetFavorite([...(User.favMovies ?? []), ...(User.favSeries ?? [])]);
  }, []);

  return (
    <>
      <Search
        value={filter?.query}
        setFilter={setFilter}
        mediaType={filter?.mediaType}
        flashListRef={flashListRef}
      />
      <MediaTypes
        filter={filter}
        setFilter={setFilter}
        flashListRef={flashListRef}
      />

      {isLoadingCondition ? (
        <LoadingIndicator />
      ) : (
        <List setFilter={setFilter} filter={filter} />
      )}
      <View
        style={[
          styles.button,
          {
            marginBottom: bottom ? 0 : rs(24),
          },
        ]}
      >
        <Button
          text="components.singleEditProfile.save"
          onPress={onPress}
          disabled={isLoading}
          isLoading={isLoading}
          shadow
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: rs(24),
  },
});

export default Favorite;
