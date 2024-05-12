import React from 'react';
import { View, StatusBar, StyleSheet, Platform } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { rs } from '@app/utils';
import { ProviderButton, Text } from '@app/components';
import * as Icons from '@app/components/icons';
import { useApp, useProvider, useUser } from '@app/hooks';

const Index = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { isDarkMode } = useApp();
  const { loginWithApple, loginWithGoogle } = useProvider();
  const { isLoading } = useUser();

  return (
    <SafeAreaView
      style={[
        styles.wrapper,
        {
          paddingTop: StatusBar.currentHeight || top,
          paddingBottom: bottom ? 0 : rs(24),
        },
      ]}
    >
      <View style={styles.svgContainer}>
        {isDarkMode ? <Icons.LetsYouInDark /> : <Icons.LetsYouInLight />}
      </View>
      <View style={styles.textContainer}>
        <Text
          text="screens.letsYouIn.welcome"
          size="h4"
          fontFamily="bold"
          align="center"
          letterSpacing={0.2}
        />
        <Text
          text="screens.letsYouIn.title"
          size="h6"
          fontFamily="medium"
          align="center"
          letterSpacing={0.2}
        />
      </View>
      <View style={styles.footerContainer}>
        {Platform.OS === 'ios' && (
          <ProviderButton
            provider="apple"
            style={styles.appleButton}
            onPress={loginWithApple}
            disabled={isLoading}
          />
        )}
        <ProviderButton
          provider="google"
          onPress={loginWithGoogle}
          disabled={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'space-between',
    flex: 1,
  },
  svgContainer: {
    alignItems: 'center',
  },
  appleButton: { marginBottom: rs(16) },
  footerContainer: {
    marginHorizontal: rs(24),
  },
  footerText: {
    letterSpacing: 0.2,
    marginTop: rs(32),
  },
  textContainer: {
    gap: rs(12),
    paddingHorizontal: rs(24),
  },
});

export default Index;
