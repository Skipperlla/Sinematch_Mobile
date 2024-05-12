import {
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { memo, useCallback, useMemo, useState } from 'react';
import Animated from 'react-native-reanimated';
import { useRoute } from '@react-navigation/native';

import { rs } from '@app/utils';
import { Pages, ScreenSizes } from '@app/constants';
import { Icon, Text } from '@app/components';
import { MediaProps } from '@app/types/redux/media';
import { Colors } from '@app/styles';
import { useAppNavigation } from '@app/hooks';

import List from './List';

type Props = {
  data: MediaProps[][];
  title: string;
};

const _MediaForm = ({ data, title }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const routeName = useRoute().name;
  const navigation = useAppNavigation();

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(
        event.nativeEvent.contentOffset.x / ScreenSizes.screenWidth,
      );
      setCurrentPage(index + 1);
    },
    [],
  );
  const memoizedData = useMemo(() => {
    return data?.map((media, index) => {
      return <List data={media} key={index} />;
    });
  }, []);
  const navigate = useCallback(() => {
    navigation.navigate(Pages.Single_Edit_Profile, {
      editType: 'Favorite',
    });
  }, []);

  if (!data?.length) return null;

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text text={title} fontFamily="bold" size="h5" />
          {Pages.My_Profile === routeName && (
            <TouchableOpacity onPress={navigate}>
              <Icon
                icon="curved_edit"
                size={rs(24)}
                color={Colors.primary500}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text
          text={`${currentPage}/${data?.length}`}
          fontFamily="medium"
          size="h6"
        />
      </View>

      <Animated.ScrollView
        horizontal
        bounces={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      >
        {memoizedData}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rs(24),
    marginBottom: rs(12),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(12),
  },
});

export default memo(_MediaForm);
