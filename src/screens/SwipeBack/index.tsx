import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useSharedValue } from 'react-native-reanimated';

import { lib, rs } from '@app/utils';
import { useApp, useAppNavigation, useDiscovery, useSwipe } from '@app/hooks';
import { Button, Icon, NewSwipeCard } from '@app/components';
import { Pages, ScreenSizes } from '@app/constants';
import type { RootRouteProps } from '@app/types/navigation';

const Index = () => {
  const { rejectUserAction } = useDiscovery();
  const { bottom } = useSafeAreaInsets();
  const { isDarkMode } = useApp();
  const { swipeRight } = useSwipe();
  const { user } = useRoute<RootRouteProps<Pages.Swipe_Back>>().params;
  const navigation = useAppNavigation();
  const currentUserId = useSharedValue('');

  const onSwipeRight = useCallback(() => {
    currentUserId.value = user.uuid;
    swipeRight(user.uuid);
    navigation.goBack();
  }, []);
  const onSwipeLeft = useCallback(async () => {
    currentUserId.value = user.uuid;
    try {
      await rejectUserAction(user.uuid);
      const timer = setTimeout(navigation.goBack, 100);
      return () => clearTimeout(timer);
    } catch {
      navigation.goBack();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={navigation.goBack}
        style={styles.previousPageButton}
      >
        <Icon
          icon="light_outline_arrow_left"
          size={rs(32)}
          color={isDarkMode ? 'white' : 'black'}
        />
      </TouchableOpacity>
      <View pointerEvents="box-none" style={styles.swipeCard}>
        <NewSwipeCard
          onSwipeRight={onSwipeRight}
          onSwipeLeft={onSwipeLeft}
          fullName={String(user?.fullName)}
          userId={String(user?.uuid)}
          age={String(lib.ageCalc(new Date(user?.info?.birthday)))}
          avatars={user?.avatars ?? []}
          biography={String(user?.info?.biography)}
          currentUserId={currentUserId}
          isSwipeBackScreen={true}
        />
      </View>
      <View style={[styles.backButton, { paddingBottom: bottom ? 0 : rs(8) }]}>
        <Button
          text="screens.swipeBack.back"
          variant="secondary"
          onPress={navigation.goBack}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  swipeCard: {
    width: ScreenSizes.windowWidth - rs(24 * 2),
    flex: 0.85,
    alignSelf: 'center',
  },
  backButton: {
    paddingHorizontal: rs(24),
    zIndex: -1,
  },
  previousPageButton: {
    justifyContent: 'center',
    width: rs(48),
    top: rs(16),
    paddingHorizontal: rs(24),
  },
});

export default Index;
