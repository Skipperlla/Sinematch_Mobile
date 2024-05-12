import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import React, { memo } from 'react';

import { useStyle } from '@app/hooks';
import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import { Text } from '@app/components';

type Props = {
  isActive: boolean;
  text: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
} & TouchableOpacity['props'];

const _Interest = ({ isActive, text, onPress, style, ...rest }: Props) => {
  const styles = useStyle(
    () => ({
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: rs(10),
      paddingHorizontal: rs(24),
      backgroundColor: isActive ? Colors.primary500 : 'transparent',
      borderRadius: 100,
      borderWidth: 2,
      marginBottom: rs(24),
      marginRight: rs(12),
      borderColor: Colors.primary500,
    }),
    [isActive],
  );

  return (
    <TouchableOpacity onPress={onPress} style={[styles, style]} {...rest}>
      <Text
        text={text}
        fontFamily="bold"
        isUseTranslation={false}
        size="bodyLarge"
        color={isActive ? 'white' : 'primary500'}
      />
    </TouchableOpacity>
  );
};

export default memo(_Interest);
