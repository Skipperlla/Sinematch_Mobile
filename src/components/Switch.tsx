import { Switch } from 'react-native';
import React, { memo } from 'react';

import { Colors } from '@app/styles';
import { useApp } from '@app/hooks';

type Props = {
  enabled: boolean;
  onSwitchChange?: () => void;
};

const _Switch = ({ enabled, onSwitchChange }: Props) => {
  const { isDarkMode } = useApp();
  const backgroundColor = enabled
    ? Colors.primary500
    : isDarkMode
    ? Colors.dark3
    : Colors.grey200;

  return (
    <Switch
      trackColor={{
        false: backgroundColor,
        true: Colors.primary500,
      }}
      thumbColor={Colors.white}
      ios_backgroundColor={backgroundColor}
      onValueChange={onSwitchChange}
      value={enabled}
    />
  );
};

export default memo(_Switch);
