import { View, StyleSheet } from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';

import { useDiscovery, useSwipe } from '@app/hooks';
import { LoadingIndicator, Text, NewSwipeCard } from '@app/components';
import { lib, rs } from '@app/utils';
import type { CatchErrorProps, LikesProps } from '@app/types/redux/discovery';

const DEFAULT_LIMIT = 10;

const Index = () => {
  const {
    likesAction,
    Likes,
    isLoading,
    setDiscoveries,
    rejectUserAction,
    setLikes,
  } = useDiscovery();
  const { swipeRight, onLayoutAnimation } = useSwipe();
  const list = useRef<FlashList<LikesProps>>(null);
  const swipeBack = useSharedValue(false);
  const currentUserId = useSharedValue('');
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [isRefresh, setIsRefresh] = useState(false);

  const onEndReached = useCallback(() => {
    if (Likes.count > limit) {
      setLimit((prev) => prev + DEFAULT_LIMIT);
      likesAction(limit + DEFAULT_LIMIT);
    }
  }, [limit, Likes.count]);
  const onRefresh = useCallback(() => {
    setIsRefresh(true);
    likesAction(limit).then(() => setIsRefresh(false));
  }, [limit]);

  const renderItem = useCallback(({ item }: { item: LikesProps }) => {
    return (
      <NewSwipeCard
        uri={String(item?.sender?.avatars?.[0]?.Location)}
        onSwipeRight={() => {
          currentUserId.value = String(item?.sender?.uuid);
          onSwipeRight(String(item?.sender?.uuid), item?.uuid);
        }}
        onSwipeLeft={() => {
          currentUserId.value = String(item?.sender?.uuid);
          onSwipeLeft(String(item?.sender?.uuid), item?.uuid);
        }}
        fullName={String(item?.sender?.fullName)}
        age={String(lib.ageCalc(item?.sender?.info?.birthday))}
        userId={String(item?.sender?.uuid)}
        swipeBack={swipeBack}
        currentUserId={currentUserId}
        activeOffsetX={[-10, 10]}
      />
    );
  }, []);
  const keyExtractor = useCallback((item: LikesProps) => item.uuid, []);
  const onSwipeRight = useCallback(
    async (userId: string, discoveryId: string) => {
      try {
        await swipeRight(userId, swipeBack);
        onLayoutAnimation(list);
        setDiscoveries(userId);
      } catch (err) {
        const error = err as CatchErrorProps;
        if (error.statusCode === 402) return;

        setDiscoveries(userId);
        setLikes(discoveryId);
        onLayoutAnimation(list);
      }
    },
    [],
  );
  const onSwipeLeft = useCallback(
    async (userId: string, discoveryId: string) => {
      try {
        await rejectUserAction(userId);
        setDiscoveries(userId);
        onLayoutAnimation(list);
      } catch {
        setDiscoveries(userId);
        setLikes(discoveryId);
        onLayoutAnimation(list);
      }
    },
    [],
  );
  const ListFooterComponent = useMemo(() => {
    return <LoadingIndicator style={styles.loadingIndicator} />;
  }, []);
  const ListEmptyComponent = useMemo(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text
          text="screens.matches.likesListEmptyTitle"
          size="bodyLarge"
          align="center"
          fontFamily="bold"
        />
        <Text
          text="screens.matches.likesListEmptyDescription"
          size="bodyMedium"
          fontFamily="regular"
          color="grey500"
          align="center"
        />
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <FlashList
        data={Likes?.discoveries}
        ListEmptyComponent={ListEmptyComponent}
        numColumns={2}
        onRefresh={onRefresh}
        refreshing={isRefresh}
        contentContainerStyle={styles.contentContainer}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={rs(244)}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReached}
        ListFooterComponent={
          isLoading && !isRefresh ? ListFooterComponent : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: { paddingTop: 20 },
  loadingIndicator: {
    marginBottom: rs(12),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: rs(24),
    paddingVertical: rs(45),
    gap: rs(12),
  },
});

export default Index;
