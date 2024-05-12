import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import dayjs from 'dayjs';

import { rs } from '@app/utils';
import { Text } from '@app/components';
import { useApp } from '@app/hooks';
import { Colors } from '@app/styles';

type Props = {
  isBirthday?: boolean;
  value?: string | number;
  icon?: JSX.Element | boolean;
} & TouchableOpacity['props'];

const _PersonalInformation = ({ isBirthday, value, icon, ...rest }: Props) => {
  const { isDarkMode } = useApp();
  const text = isBirthday
    ? dayjs(value).format('LL')
    : typeof value === 'number'
    ? `components.button.personalInformation.${value}`
    : String(value);

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={true}
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? Colors.dark2 : Colors.grey50,
          display: value ? 'flex' : 'none',
        },
      ]}
      {...rest}
    >
      <Text
        fontFamily="semiBold"
        size="bodyMedium"
        text={text}
        style={styles.text}
      />

      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rs(24),
    minHeight: rs(56),
    borderRadius: 16,
    paddingVertical: rs(16),
  },
  text: {
    letterSpacing: 0.2,
    flex: 1,
  },
  icon: {
    marginLeft: rs(12),
  },
});

export default memo(_PersonalInformation);
