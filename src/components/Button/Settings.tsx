import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { memo, useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';

import { rs } from '@app/utils';
import { Icon, Text } from '@app/components';
import { useApp, useAppNavigation } from '@app/hooks';
import { Colors } from '@app/styles';

type Props = {
  background: string[];
  icon: string;
  label: string;
  currentLanguage?: string;
  //TODO: fix any
  page?: any;
  func?: () => void;
  disabled?: boolean;
};

const _Settings = ({
  background,
  icon,
  label,
  currentLanguage,
  page,
  func,
  disabled,
}: Props) => {
  const { isDarkMode } = useApp();
  const navigation = useAppNavigation();
  const navigate = useCallback(() => navigation.navigate(page), []);

  return (
    <TouchableOpacity
      onPress={func ?? navigate}
      style={styles.container}
      disabled={disabled}
    >
      <LinearGradient
        style={styles.linearGradient}
        colors={background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 1]}
      >
        <Icon icon={icon} size={rs(20)} color={Colors.white} />
      </LinearGradient>
      <Text
        fontFamily="semiBold"
        size="bodyXLarge"
        text={`components.button.settings.${label}`}
        style={styles.text}
      />
      {currentLanguage && (
        <Text fontFamily="semiBold" size="bodyXLarge" text={currentLanguage} />
      )}
      <Icon
        icon="light_arrow_right_2"
        size={rs(20)}
        color={isDarkMode ? Colors.white : Colors.grey900}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(20),
  },
  linearGradient: {
    borderRadius: 999,
    padding: rs(8),
  },
  text: {
    flex: 1,
  },
});

export default memo(_Settings);
