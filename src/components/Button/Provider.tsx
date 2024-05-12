import React, { memo, useMemo } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';

import { Text } from '@app/components';
import * as Icons from '@app/components/icons';
import { useApp, useStyle } from '@app/hooks';
import { Colors } from '@app/styles';
import { rs } from '@app/utils';

type Props = {
  isLoading?: boolean;
  provider: 'apple' | 'google';
  withoutText?: boolean;
} & TouchableOpacity['props'];

const useButtonStyle = (withoutText?: boolean, isDarkMode?: boolean) => {
  return useStyle(
    () => ({
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      height: rs(60),
      borderWidth: 1,
      borderColor: isDarkMode ? Colors.dark3 : Colors.grey200,
      backgroundColor: isDarkMode ? Colors.dark2 : Colors.white,
      width: withoutText ? rs(87) : '100%',
      flexDirection: 'row',
    }),
    [isDarkMode],
  );
};

const Button = ({
  isLoading = false,
  provider,
  style,
  withoutText = false,
  ...rest
}: Props) => {
  const { isDarkMode } = useApp();
  const _style = useButtonStyle(withoutText, isDarkMode);
  const _textStyle = useStyle(
    () => ({
      letterSpacing: 0.2,
      marginLeft: rs(12),
    }),
    [],
  );

  const icon = useMemo(() => {
    if (provider === 'apple') return <Icons.Apple />;
    else return <Icons.Google />;
  }, []);
  const text = useMemo(() => {
    if (provider === 'apple') return 'components.apple';
    else return 'components.google';
  }, []);

  if (isLoading)
    return (
      <TouchableOpacity style={[_style, style]} {...rest}>
        <ActivityIndicator color={isDarkMode ? Colors.white : Colors.grey900} />
      </TouchableOpacity>
    );

  return (
    <TouchableOpacity style={[_style, style]} {...rest}>
      {icon}
      {!withoutText && (
        <Text
          size="bodyLarge"
          align="center"
          fontFamily="semiBold"
          text={text}
          style={_textStyle}
        />
      )}
    </TouchableOpacity>
  );
};

export default memo(Button);
