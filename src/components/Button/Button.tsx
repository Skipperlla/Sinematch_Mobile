import { TouchableOpacity, ActivityIndicator, ViewStyle } from 'react-native';
import React, { memo } from 'react';

import { Text } from '@app/components';
import { useApp, useStyle } from '@app/hooks';
import { Colors } from '@app/styles';
import { rs } from '@app/utils';

type Shape = 'filled' | 'rounded';
type Variant = 'primary' | 'secondary';
type Props = {
  text?: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  icon?: JSX.Element;
  isLoading?: boolean;
  style?: ViewStyle;
  variant?: Variant;
  shape?: Shape;
  iconType?: boolean;
  shadow?: boolean;
  width?: number;
  height?: number;
} & TouchableOpacity['props'];

const useButtonStyle = (
  disabled: boolean | undefined,
  shape: Shape,
  variant: Variant,
  iconType: boolean | undefined,
  isDarkMode: boolean,
  width: number,
  height: number,
) => {
  return useStyle(
    () => ({
      backgroundColor: disabled
        ? Colors.disabledButton
        : variant === 'primary'
        ? Colors.primary500
        : isDarkMode && variant === 'secondary'
        ? Colors.dark3
        : Colors.primary100,
      borderRadius: shape === 'filled' ? 16 : 100,
      minHeight: rs(height),
      width: iconType ? rs(width) : '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    [disabled, isDarkMode],
  );
};

const Button = ({
  text,
  leftIcon,
  rightIcon,
  style,
  isLoading = false,
  shape = 'rounded',
  variant = 'primary',
  iconType = false,
  shadow = false,
  icon,
  width = 56,
  height = 56,
  ...rest
}: Props) => {
  const { isDarkMode } = useApp();
  const _style = useButtonStyle(
    rest?.disabled,
    shape,
    variant,
    iconType,
    isDarkMode,
    width,
    height,
  );
  const _textStyle = useStyle(
    () => ({
      letterSpacing: 0.2,
    }),
    [],
  );
  const shadowStyle = useStyle(
    () => ({
      shadowColor: Colors.primary500,
      shadowOffset: { width: 4, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 16,
    }),
    [],
  );

  if (isLoading)
    return (
      <TouchableOpacity
        style={[_style, style, shadow && shadowStyle]}
        {...rest}
      >
        <ActivityIndicator color={Colors.white} />
      </TouchableOpacity>
    );
  else if (iconType)
    return (
      <TouchableOpacity
        style={[_style, style, shadow && shadowStyle]}
        {...rest}
      >
        {icon}
      </TouchableOpacity>
    );

  return (
    <TouchableOpacity
      style={[
        _style,
        style,
        shadow && shadowStyle,
        {
          paddingHorizontal: rs(16),
          paddingVertical: rs(18),
        },
      ]}
      {...rest}
    >
      {leftIcon}
      <Text
        size="bodyLarge"
        align="center"
        fontFamily="bold"
        color={variant === 'secondary' && !isDarkMode ? 'primary500' : 'white'}
        text={String(text)}
        style={_textStyle}
      />
      {rightIcon}
    </TouchableOpacity>
  );
};

export default memo(Button);
