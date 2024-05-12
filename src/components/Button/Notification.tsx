import { View } from 'react-native';
import React, { memo } from 'react';

import { Text, Switch } from '@app/components';
import { useStyle } from '@app/hooks';

type Props = {
  label: string;
  value: boolean;
  onSwitchChange: () => void;
};

const _Notification = ({ label, value, onSwitchChange }: Props) => {
  const style = useStyle(
    () => ({
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }),
    [],
  );

  return (
    <View style={style}>
      <Text
        fontFamily="semiBold"
        size="bodyXLarge"
        text={`components.button.notification.${label}`}
      />
      <Switch enabled={value} onSwitchChange={onSwitchChange} />
    </View>
  );
};

export default memo(_Notification);
