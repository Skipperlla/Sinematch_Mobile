import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';

import { Button, Icon, StepIndicator, Text } from '@app/components';
import {
  useApp,
  useAppNavigation,
  useTelegramTransitions,
  useUser,
  useTranslation,
} from '@app/hooks';
import { rs } from '@app/utils';
import { Pages } from '@app/constants';
import { Colors } from '@app/styles';

type Props = PropsWithChildren<{
  title?: string;
  subTitle?: string;
  description?: string;
  onPress: () => void;
  isDisabled?: boolean;
  buttonText?: string;
}>;

const Layout = ({
  title,
  subTitle,
  description,
  children,
  onPress,
  isDisabled,
  buttonText = 'screens.signUp.continue',
}: Props) => {
  const { top, bottom } = useSafeAreaInsets();

  const { height: IOSHeight } = useTelegramTransitions();
  const { height: AndroidHeight } = useReanimatedKeyboardAnimation();

  const { isDarkMode, defaultLanguage } = useApp();
  const { t } = useTranslation();
  const navigation = useAppNavigation();
  const { User, isLoading } = useUser();
  const route = useRoute();

  const textInputStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY:
            Platform.OS === 'ios' ? IOSHeight.value : AndroidHeight.value,
        },
      ],
    }),
    [],
  );

  return (
    <View
      style={[
        styles.wrapper,
        {
          marginBottom: bottom || rs(24),
          //? X ve ustu olmayan telefonlar icin +15 deger eklendi cunku cok fazla yapisik ust tarafa
          paddingTop: Platform.OS === 'ios' && bottom ? top : top + 15,
          paddingHorizontal: route.name === Pages.Favorite ? 0 : rs(24),
        },
      ]}
    >
      <StepIndicator />
      {route.name !== Pages.FullName && (
        <TouchableOpacity
          onPress={navigation.goBack}
          style={[
            styles.goBackButton,
            {
              paddingHorizontal: route.name === Pages.Favorite ? rs(24) : 0,
            },
          ]}
        >
          <Icon
            icon="light_outline_arrow_left"
            size={rs(32)}
            color={isDarkMode ? Colors.white : Colors.grey900}
          />
        </TouchableOpacity>
      )}
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <View
            style={{
              paddingHorizontal: route.name === Pages.Favorite ? rs(24) : 0,
              gap: rs(16),
              marginBottom: rs(16),
            }}
          >
            {title && (
              <Text
                text={t(title, {
                  fullName: User?.fullName,
                  lng: defaultLanguage,
                })}
                fontFamily="bold"
                size="bodyXLarge"
              />
            )}
            {subTitle && (
              <Text text={subTitle} fontFamily="bold" size="bodyXLarge" />
            )}
            {description && (
              <Text text={description} fontFamily="medium" size="bodySmall" />
            )}
          </View>
          {children}
        </View>
      </View>
      <Animated.View
        style={[
          {
            paddingHorizontal: route.name === Pages.Favorite ? rs(24) : 0,
          },
          Pages.Favorite === route.name ? undefined : textInputStyle,
        ]}
      >
        <Button
          text={buttonText}
          onPress={onPress}
          disabled={isLoading || isDisabled}
          isLoading={isLoading}
          shadow
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },

  goBackButton: {
    width: rs(32),
    marginVertical: rs(16),
  },
  textContainer: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
  },
});

export default Layout;
