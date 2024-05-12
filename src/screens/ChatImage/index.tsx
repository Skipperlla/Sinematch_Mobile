import React, { useCallback, useRef } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';

import { Pages, ScreenSizes } from '@app/constants';
import { rs } from '@app/utils';
import { Icon } from '@app/components';
import { useAppNavigation } from '@app/hooks';
import { MessageService } from '@app/api';
import { Colors } from '@app/styles';
import ImageContainer from '@app/components/ImageModal/ImageContainer';
import type { ImageProps } from '@app/types/redux/user';
import type { RootRouteProps } from '@app/types/navigation';

const Index = () => {
  const { params } = useRoute<RootRouteProps<Pages.Chat_Image>>();
  const navigation = useAppNavigation();
  const carouselRef = useRef<FlatList>(null);
  const { data } = useQuery(
    [params.conversationId],
    () => MessageService.messages(params.conversationId),
    {
      enabled: false,
    },
  );

  const carouselImages =
    data
      ?.map((item) => item?.image)
      ?.filter((item): item is ImageProps => item !== undefined)
      ?.reverse() ?? [];

  const initialScrollIndex = carouselImages?.findIndex(
    (item) => item?.Location === params.uri,
  );

  const { top } = useSafeAreaInsets();
  const backButtonOpacity = useSharedValue(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length)
        carouselRef.current?.scrollToIndex({
          index: Number(viewableItems[0].index),
          animated: false,
        });
    },
    [],
  );
  const renderItem = useCallback(({ item }: { item: ImageProps }) => {
    return (
      <ImageContainer
        uri={item.Location}
        backButtonOpacity={backButtonOpacity}
      />
    );
  }, []);
  const keyExtractor = useCallback((item: ImageProps) => item.key, []);
  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: { viewAreaCoveragePercentThreshold: 50 },
      onViewableItemsChanged,
    },
  ]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View
          style={[
            styles.backButton,
            {
              top: StatusBar.currentHeight ?? top,
            },
          ]}
        >
          <TouchableOpacity onPress={navigation.goBack}>
            <Icon icon="close_outline" size={rs(32)} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={carouselImages}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          renderItem={renderItem}
          initialScrollIndex={initialScrollIndex}
          getItemLayout={(_, index) => ({
            length: ScreenSizes.screenWidth,
            offset: ScreenSizes.screenWidth * index,
            index,
          })}
          style={styles.flatListStyle}
          keyExtractor={keyExtractor}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
    paddingHorizontal: rs(240),
  },
  container: {
    width: ScreenSizes.screenWidth,
    height: ScreenSizes.screenHeight,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: { marginVertical: rs(32) },
  title: { marginBottom: rs(16) },
  subTitle: { letterSpacing: 0.2 },
  flatListStyle: {
    width: ScreenSizes.screenWidth,
    height: ScreenSizes.screenHeight,
  },
  backButton: {
    zIndex: 1,
    position: 'absolute',
    right: rs(12),
  },
});

export default Index;
