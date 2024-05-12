import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

import { DiscoveryContext, rs } from '@app/utils';
import { FastImage, Icon, Ring, TopBar } from '@app/components';
import { useApp, useAppNavigation, useDiscovery, useUser } from '@app/hooks';
import { Colors } from '@app/styles';
import { Pages } from '@app/constants';

import Discovery from './Discovery';

const SIZE = rs(86);
const animationConfig = {
  entering: Platform.OS === 'ios' ? FadeIn : undefined,
  exiting: Platform.OS === 'ios' ? FadeOut : undefined,
  layout: Platform.OS === 'ios' ? Layout.delay(100) : undefined,
};

const Index = () => {
  const { allDiscoveriesAction } = useDiscovery();
  const { isDarkMode } = useApp();
  const { User } = useUser();
  const navigation = useAppNavigation();
  const {
    memoizedCards,
    setCurrentIndex,
    currentUserId,
    swipeBack,
    userIndex,
  } = DiscoveryContext.useDiscovery();

  const navigate = useCallback(
    () => navigation.navigate(Pages.Discovery_Settings),
    [],
  );

  useEffect(() => {
    allDiscoveriesAction();
  }, []);
  useFocusEffect(
    useCallback(() => {
      const resendFetch = setTimeout(() => {
        if (!memoizedCards?.length)
          allDiscoveriesAction().then(() => {
            setCurrentIndex(0);
            currentUserId.value = '';
            swipeBack.value = false;
            userIndex.value = 1;
          });
      }, 10000);

      return () => clearTimeout(resendFetch);
    }, [memoizedCards]),
  );

  return (
    <View style={styles.container}>
      <TopBar>
        <TouchableOpacity onPress={navigate}>
          <Icon
            icon="light_filter"
            size={rs(28)}
            color={isDarkMode ? Colors.white : Colors.grey900}
          />
        </TouchableOpacity>
      </TopBar>

      {memoizedCards?.length > 0 ? (
        <Animated.View
          key="discovery"
          {...animationConfig}
          style={[
            {
              flex: 1,
            },
          ]}
        >
          <Discovery />
        </Animated.View>
      ) : (
        <Animated.View
          key="loading"
          {...animationConfig}
          style={[styles.ringContainer]}
        >
          {[...Array(3).keys()].map((_, index) => (
            <Ring key={index} index={index} />
          ))}
          <FastImage
            uri={String(User?.avatars?.[0]?.Location)}
            width={SIZE}
            height={SIZE}
            borderRadius={999}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundStyle: {
    borderRadius: 44,
  },
  bottomSheetViewContainer: {
    marginHorizontal: rs(24),
  },
  ringContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Index;
