import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';

import { LoadingIndicator } from '@app/components';
import { useAccountSetup, useMedia, useUser } from '@app/hooks';
import type { MediaProps } from '@app/types/redux/media';

import Layout from '../Layout';
import List from './List';
import Search from './Search';
import MediaTypes from './MediaTypes';

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
  const { MultiSearch } = useMedia();
  const { addFavoriteAction, removeFavoriteAction, User } = useUser();
  const { nextPage } = useAccountSetup();
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

  const onPress = useCallback(() => {
    if (
      (User?.favMovies?.length || User?.favSeries?.length) &&
      ExcludedFavorites?.length
    )
      return removeFavoriteAction(ExcludedFavorites).then(() => {
        return addFavoriteAction(SelectedFavorites).then(nextPage);
      });
    else if (SelectedFavorites?.length)
      return addFavoriteAction(SelectedFavorites).then(nextPage);
  }, [
    ExcludedFavorites,
    SelectedFavorites,
    User?.favMovies?.length,
    User?.favSeries?.length,
  ]);

  useEffect(() => {
    popularMediasAction(undefined).then(() => setIsFirstLoading(false));
  }, []);

  return (
    <Layout
      title="screens.signUp.favorite.title"
      description="screens.signUp.favorite.description"
      onPress={onPress}
      isDisabled={!SelectedFavorites?.length}
    >
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
    </Layout>
  );
};

export default Favorite;
