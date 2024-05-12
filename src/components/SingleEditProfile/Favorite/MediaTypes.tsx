import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';

import { useApp, useMedia } from '@app/hooks';
import { Text } from '@app/components';
import { Colors } from '@app/styles';
import { ScreenSizes } from '@app/constants';
import { rs } from '@app/utils';

import type { FilterProps, FlashListRef } from '.';

type Props = {
  filter: FilterProps;
  setFilter: React.Dispatch<React.SetStateAction<FilterProps>>;
  flashListRef: React.RefObject<FlashListRef>;
};

const mediaTypes: Array<{ name: string; value: string }> = [
  { name: 'mediaTypes.movie', value: 'movie' },
  { name: 'mediaTypes.tv', value: 'tv' },
];

const MediaTypes = ({ filter, setFilter, flashListRef }: Props) => {
  const { multiSearchAction, popularMediasAction, setIsSearching } = useMedia();
  const { isDarkMode } = useApp();

  //TODO: Maybe we can this convert to clean code
  const onSelectFilterType = useCallback(
    (media: string) => {
      setFilter((prevState) => ({
        ...prevState,
        mediaType: filter?.mediaType === media ? undefined : media,
        page: 1,
      }));

      setIsSearching(true);
      if (filter.query) {
        flashListRef?.current?.scrollToOffset({
          offset: 0,
          animated: true,
        });
        multiSearchAction({
          query: filter.query,
          page: 1,
          mediaType: filter?.mediaType === media ? undefined : media,
        });
      } else
        popularMediasAction(filter?.mediaType === media ? undefined : media);
    },
    [filter],
  );

  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.container}
      >
        {mediaTypes.map((media, index) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => onSelectFilterType(media.value)}
              style={[
                style.button,
                {
                  borderColor:
                    filter.mediaType === media.value
                      ? Colors.primary500
                      : isDarkMode
                      ? Colors.grey600
                      : Colors.grey200,
                  marginRight: !index ? rs(8) : 0,
                },
              ]}
            >
              <Text text={media.name} fontFamily="regular" size="bodyMedium" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  button: {
    width: (ScreenSizes.screenWidth - rs(24) * 2) / 2,
    paddingHorizontal: rs(16),
    borderWidth: 1,
    borderRadius: 999,
    marginTop: rs(12),
    paddingVertical: rs(16) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: rs(24),
  },
});

export default MediaTypes;
