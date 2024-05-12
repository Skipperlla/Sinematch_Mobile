import React, { memo, useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { Text, Icon } from '@app/components';
import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import { useApp, useAppNavigation } from '@app/hooks';
import type { ColorProps } from '@app/types/colors';

type Props = {
  label: string;
  icon: string;
  labelColor?: keyof ColorProps;
  iconColor?: string;
  //TODO: fix any
  page: any;
  func?: () => void;
};

const _ProfileAction = ({
  icon,
  iconColor,
  label,
  labelColor,
  page,
  func,
}: Props) => {
  const { isDarkMode } = useApp();
  const navigation = useAppNavigation();
  const navigate = useCallback(() => navigation.navigate(page), []);
  const baseIconColor = isDarkMode ? Colors.white : Colors.grey900;

  return (
    <TouchableOpacity style={styles.container} onPress={func || navigate}>
      <Icon
        icon={icon}
        color={iconColor ?? baseIconColor}
        width={24}
        height={24}
      />
      <Text
        fontFamily="semiBold"
        size="bodyLarge"
        color={labelColor ?? undefined}
        text={label}
        style={styles.text}
      />
      {!iconColor && (
        <Icon
          icon="light_arrow_right_2"
          color={baseIconColor}
          width={24}
          height={24}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginHorizontal: rs(20),
    flex: 1,
    letterSpacing: 0.2,
  },
});

export default memo(_ProfileAction);
