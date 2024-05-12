import { StyleProp, Text, TextProps, TextStyle, ViewStyle } from 'react-native';
import React, { memo } from 'react';

import { useApp, useStyle, useTranslation } from '@app/hooks';
import { Colors, Fonts, Sizes } from '@app/styles';
import type { ColorProps } from '@app/types/colors';

type Props = {
  text: string;
  color?: keyof ColorProps;
  size: keyof typeof Sizes;
  fontFamily: keyof typeof Fonts;
  style?: StyleProp<ViewStyle | TextStyle>;
  align?: TextStyle['textAlign'];
  isUseTranslation?: boolean;
  letterSpacing?: number;
} & TextProps;

const useTextStyle = (
  color: keyof ColorProps,
  fontFamily: keyof typeof Fonts,
  size: keyof typeof Sizes,
  align?: TextStyle['textAlign'],
  letterSpacing?: number,
) => {
  return useStyle(
    () => ({
      color: Colors[color],
      fontFamily: Fonts[fontFamily],
      fontSize: Sizes[size],
      textAlign: align,
      letterSpacing,
    }),
    [color],
  );
};

const _Text = ({
  text,
  size,
  fontFamily,
  style,
  color,
  align,
  isUseTranslation = true,
  letterSpacing,
  ...rest
}: Props) => {
  const { t } = useTranslation();
  const { isDarkMode } = useApp();
  const baseColor = isDarkMode ? 'white' : 'grey900';

  const _style = useTextStyle(
    color ?? baseColor,
    fontFamily,
    size,
    align,
    letterSpacing,
  );

  return (
    <Text style={[style, _style]} {...rest}>
      {isUseTranslation ? t(text) : text}
    </Text>
  );
};

export default memo(_Text);
