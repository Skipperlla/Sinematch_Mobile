import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { BlockedUserButton, SettingsContainer, Text } from '@app/components';
import { useUser } from '@app/hooks';
import { rs } from '@app/utils';
import type { UserProps } from '@app/types/redux/user';

const Index = () => {
  const { getBlockUsersAction, Blocked, unBlockUserAction } = useUser();
  const list = useRef<FlashList<UserProps>>(null);
  const [isRefresh, setIsRefresh] = useState(false);

  const renderItem = useCallback(({ item }: { item: UserProps }) => {
    return (
      <BlockedUserButton
        uri={String(item?.avatars?.[0]?.Location)}
        fullName={String(item?.fullName)}
        userName={String(item?.userName)}
        onBlockUser={() => onBlockUser(String(item?.uuid))}
      />
    );
  }, []);
  const keyExtractor = useCallback((item: UserProps) => {
    return String(item.uuid);
  }, []);
  const onBlockUser = useCallback(
    (userId: string) =>
      unBlockUserAction(userId).then(() => {
        if (Platform.OS === 'android') return;
        list.current?.prepareForLayoutAnimationRender();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }),
    [],
  );
  const ListEmptyComponent = useCallback(() => {
    return (
      <Text
        fontFamily="medium"
        size="bodyLarge"
        text="screens.blockedUsers.noData"
        align="center"
        style={styles.emptyComponentText}
      />
    );
  }, []);
  const onRefresh = useCallback(() => {
    setIsRefresh(true);
    getBlockUsersAction().then(() => setIsRefresh(false));
  }, []);

  useEffect(() => {
    getBlockUsersAction();
  }, []);

  return (
    <SettingsContainer title="screens.blockedUsers.title">
      <FlashList
        data={Blocked}
        ref={list}
        refreshing={isRefresh}
        onRefresh={onRefresh}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={95}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        ListEmptyComponent={ListEmptyComponent}
      />
    </SettingsContainer>
  );
};

const styles = StyleSheet.create({
  emptyComponentText: {
    marginVertical: rs(56),
  },
});

export default Index;
