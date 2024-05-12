import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { FavoriteCard, LoadingIndicator, Text } from '@app/components';
import { useApp, useMedia } from '@app/hooks';
import { rs } from '@app/utils';
import type { MediaProps } from '@app/types/redux/media';

import type { FilterProps, FlashListRef } from './Index';

type Props = {
  setFilter: React.Dispatch<React.SetStateAction<FilterProps>>;
  filter: FilterProps;
};

const List = forwardRef<FlashListRef, Props>(({ filter, setFilter }, ref) => {
  const { PopularMedias, MultiSearch, multiSearchAction, isLoading } =
    useMedia();
  const { defaultLanguage } = useApp();

  const renderItem = useCallback(({ item }: { item: MediaProps }) => {
    return (
      <FavoriteCard
        posterPath={item.posterPath}
        title={item.title}
        mediaType={item.mediaType}
        vote={Number(item.vote)}
        genreIds={item.genreIds}
        id={item.id}
      />
    );
  }, []);
  const keyExtractor = useCallback((item: MediaProps) => String(item.id), []);
  const infiniteScroll = useCallback(() => {
    if (filter.query && MultiSearch.total_pages >= Number(filter?.page) + 1) {
      setFilter((prevState) => ({
        ...prevState,
        page: Number(prevState.page) + 1,
      }));
      multiSearchAction({
        ...filter,
        page: Number(filter.page) + 1,
      });
    }
  }, [MultiSearch.total_pages, filter]);
  const ListFooterComponent = useMemo(() => {
    if (isLoading) return <LoadingIndicator style={styles.loadingIndicator} />;
    else if (MultiSearch.total_pages <= Number(filter?.page))
      return (
        <View
          style={[
            styles.noMoreDataContainer,
            {
              flexDirection: defaultLanguage === 'tr' ? 'row' : 'row-reverse',
            },
          ]}
        >
          <Text
            fontFamily="bold"
            size="bodySmall"
            text={filter?.query}
            color="primary500"
          />
          <Text
            fontFamily="regular"
            size="bodySmall"
            text="screens.signUp.favorite.noMoreData"
          />
        </View>
      );

    return null;
  }, [isLoading, MultiSearch?.total_pages, filter?.page, filter?.query]);

  return (
    <View style={styles.container}>
      <FlashList
        ref={ref}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        data={MultiSearch?.results || PopularMedias}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={rs(78)}
        onEndReachedThreshold={0.2}
        onEndReached={infiniteScroll}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: rs(12),
  },

  contentContainer: {
    paddingHorizontal: rs(24),
  },
  noMoreDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: rs(12),
  },

  loadingIndicator: {
    marginBottom: rs(12),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: rs(350),
  },
});

export default List;
