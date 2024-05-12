import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import React, { memo } from 'react';

import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import { Icon, Text } from '@app/components';
import { useApp } from '@app/hooks';

type Props = {
  selected: boolean;
  text: string;
  style?: ViewStyle;
  icon: string;
} & TouchableOpacity['props'];

const _Gender = ({ selected, text, style, icon, ...rest }: Props) => {
  const { isDarkMode } = useApp();

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[
        styles.container,
        style,
        {
          borderColor: selected
            ? Colors.primary400
            : isDarkMode
            ? Colors.dark3
            : Colors.grey200,
          backgroundColor: isDarkMode ? Colors.dark2 : Colors.white,
        },
      ]}
      {...rest}
    >
      <View style={styles.circle}>
        <Icon icon={icon} size={rs(32)} color={Colors.primary400} />
      </View>
      <Text
        fontFamily="bold"
        size="h6"
        style={styles.text}
        color={selected ? 'primary400' : isDarkMode ? 'white' : 'grey900'}
        align="center"
        text={text}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: rs(156),
    width: rs(156),
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  text: {
    marginTop: rs(12),
  },
  circle: {
    width: rs(80),
    height: rs(80),
    borderRadius: 100,
    backgroundColor: Colors.transparentPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(_Gender);
