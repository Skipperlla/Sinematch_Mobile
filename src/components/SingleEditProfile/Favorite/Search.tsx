import { View, StyleSheet, Keyboard } from 'react-native';
import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { FlashList } from '@shopify/flash-list';

import { Icon, Input } from '@app/components';
import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import { useApp, useMedia } from '@app/hooks';
import type { MediaProps } from '@app/types/redux/media';

import type { FilterProps } from '.';

type Props = {
  value: string;
  setFilter: React.Dispatch<React.SetStateAction<FilterProps>>;
  flashListRef: React.RefObject<FlashList<MediaProps>>;
  mediaType?: string;
};

const Search = ({ value, setFilter, mediaType, flashListRef }: Props) => {
  const { multiSearchAction, popularMediasAction, setIsSearching } = useMedia();
  const { isDarkMode } = useApp();
  const [activeInput, setActiveInput] = useState<boolean>(false);

  const baseColor = isDarkMode ? Colors.grey600 : Colors.grey400;

  const onFocusChange = useCallback(
    (focused: boolean) => setActiveInput(focused),
    [],
  );
  const debouncedSearch = useCallback(
    debounce((inputText: string) => {
      if (inputText)
        multiSearchAction({
          query: inputText,
          mediaType,
          page: 1,
        });
      else
        popularMediasAction(undefined).then(() =>
          setFilter((prevState) => ({
            ...prevState,
            query: '',
            page: 1,
          })),
        );
      flashListRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }, 500),
    [mediaType],
  );
  const onChangeText = useCallback(
    (text: string) => {
      setIsSearching(true);
      setFilter((prevState) => ({
        ...prevState,
        query: text,
        page: 1,
      }));
      debouncedSearch(text);
    },
    [mediaType],
  );

  return (
    <View style={styles.container}>
      <Input
        leftIcon={
          <Icon
            icon="light_search"
            size={rs(20)}
            color={activeInput ? Colors.primary500 : baseColor}
            style={styles.icon}
          />
        }
        onChangeText={onChangeText}
        value={value}
        placeholderText="screens.signUp.favorite.searchMedia"
        placeholderTextColor={baseColor}
        onFocusChange={onFocusChange}
        editable={mediaType !== 'all'}
        onSubmitEditing={Keyboard.dismiss}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rs(24),
  },
  icon: {
    marginRight: rs(10),
  },
});

export default Search;
