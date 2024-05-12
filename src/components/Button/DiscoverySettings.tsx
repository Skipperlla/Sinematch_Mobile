import { TouchableOpacity } from 'react-native';
import React, { memo } from 'react';

import { useStyle } from '@app/hooks';
import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import { Text } from '@app/components';

type Props = {
  label: string;
  isEqual: boolean;
  onSetGenderPreference: () => void;
};

const _DiscoverySettings = ({
  label,
  isEqual,
  onSetGenderPreference,
}: Props) => {
  const style = useStyle(
    () => ({
      paddingVertical: rs(10),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isEqual ? Colors.primary500 : 'transparent',
      borderRadius: 100,
      borderWidth: isEqual ? 2 : 2,
      borderColor: Colors.primary500,
      flex: 0.3,
    }),
    [isEqual],
  );

  return (
    <TouchableOpacity onPress={onSetGenderPreference} style={style}>
      <Text
        text={label}
        fontFamily="bold"
        size="bodyXLarge"
        color={isEqual ? 'white' : 'primary500'}
      />
    </TouchableOpacity>
  );
};

export default memo(_DiscoverySettings);
