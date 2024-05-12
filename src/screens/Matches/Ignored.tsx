import { View, StyleSheet, LayoutAnimation, Platform } from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDiscovery } from '@app/hooks';
import { FlashList } from '@shopify/flash-list';

import { LoadingIndicator, IgnoredCard, Text } from '@app/components';
import { lib, rs } from '@app/utils';
import type { IgnoredProps } from '@app/types/redux/discovery';

const DEFAULT_LIMIT = 10;

const Index = () => {
  const { ignoredAction, Ignored, isLoading } = useDiscovery();
  const list = useRef<FlashList<IgnoredProps>>(null);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const onEndReached = useCallback(() => {
    if (Ignored.count > limit) {
      setLimit((prev) => prev + DEFAULT_LIMIT);
      ignoredAction(limit + DEFAULT_LIMIT);
    }
  }, [limit, Ignored.count]);
  const onRefresh = useCallback(() => {
    setIsRefresh(true);
    ignoredAction(limit).then(() => setIsRefresh(false));
  }, [limit]);
  const renderItem = useCallback(({ item }: { item: IgnoredProps }) => {
    return (
      <IgnoredCard
        uri={String(item?.user?.avatars?.[0]?.Location)}
        fullName={String(item?.user?.fullName)}
        age={lib.ageCalc(item?.user?.info?.birthday)}
        receiverId={String(item?.user?.uuid)}
        onLayoutAnimation={onLayoutAnimation}
        discoveryId={item.uuid}
      />
    );
  }, []);
  const keyExtractor = useCallback((item: IgnoredProps) => item.uuid, []);
  const onLayoutAnimation = useCallback(() => {
    if (Platform.OS === 'android') return;
    list.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);
  const ListFooterComponent = useMemo(() => {
    return <LoadingIndicator style={styles.loadingIndicator} />;
  }, []);
  const ListEmptyComponent = useMemo(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text
          text="screens.matches.ignoredListEmptyTitle"
          size="bodyLarge"
          fontFamily="bold"
        />
        <Text
          text="screens.matches.ignoredListEmptyDescription"
          size="bodyMedium"
          fontFamily="regular"
          color="grey500"
          align="center"
        />
      </View>
    );
  }, []);

  useEffect(() => {
    ignoredAction(limit).then(() => setIsFirstLoading(false));
  }, []);

  if (isFirstLoading)
    return <LoadingIndicator style={styles.loadingIndicator} />;

  return (
    <View style={styles.container}>
      <FlashList
        data={Ignored?.discoveries}
        ListEmptyComponent={ListEmptyComponent}
        numColumns={2}
        onRefresh={onRefresh}
        refreshing={isRefresh}
        contentContainerStyle={styles.contentContainer}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReached}
        estimatedItemSize={rs(244)}
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
