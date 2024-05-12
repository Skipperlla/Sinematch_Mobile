import { View, StyleSheet } from 'react-native';
import React from 'react';

import { NewSwipeCard } from '@app/components';
import { DiscoveryContext, lib, rs } from '@app/utils';

const Discovery = () => {
  const {
    memoizedCards,
    onSwipeRight,
    userIndex,
    swipeBack,
    onSwipeLeft,
    currentUserId,
  } = DiscoveryContext.useDiscovery();

  return (
    <View style={styles.cardContainer}>
      {memoizedCards?.map((item) => {
        return (
          <NewSwipeCard
            key={item?._id}
            onSwipeRight={() => {
              const userId = memoizedCards?.[userIndex.value]?.uuid;
              onSwipeRight(userId);
            }}
            onSwipeLeft={() => {
              const userId = memoizedCards?.[userIndex.value]?.uuid;
              onSwipeLeft(userId);
            }}
            fullName={String(item?.fullName)}
            userId={String(item?.uuid)}
            age={String(lib.ageCalc(item?.info?.birthday))}
            avatars={item?.avatars ?? []}
            biography={String(item?.info?.biography)}
            swipeBack={swipeBack}
            currentUserId={currentUserId}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: rs(24),
    marginBottom: rs(24),
    flex: 1,
  },
});

export default Discovery;
