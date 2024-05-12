import { TouchableOpacity, StyleSheet } from 'react-native';
import React, { memo } from 'react';

import { Icon, Text } from '@app/components';
import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import { useApp } from '@app/hooks';

type Props = {
  label: string;
  func: () => void;
};

const _HelpCenter = ({ label, func }: Props) => {
  const { isDarkMode } = useApp();

  return (
    <TouchableOpacity style={styles.container} onPress={func}>
      <Text
        fontFamily="semiBold"
        size="bodyXLarge"
        text={label}
        style={styles.text}
      />
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
  text: {
    flex: 1,
  },
});

export default memo(_HelpCenter);
