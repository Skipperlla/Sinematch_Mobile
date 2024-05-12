import React, { forwardRef, memo, useCallback, useState } from 'react';
import { TextInput, ViewStyle, View, TextStyle } from 'react-native';

import { useApp, useStyle, useTranslation } from '@app/hooks';
import { rs } from '@app/utils';
import { Colors, Fonts, Sizes } from '@app/styles';

type Props = {
  placeholderText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  onFocusChange?: (focused: boolean) => void;
} & TextInput['props'];

const useContainerStyle = (
  onFocus: boolean,
  value: string | undefined,
  isDarkMode: boolean,
) => {
  return useStyle(
    () => ({
      borderWidth: onFocus ? 1 : 0,
      borderColor: Colors.primary500,
      paddingHorizontal: rs(20),
      // minHeight: rs(56),
      minHeight: rs(56),
      backgroundColor: onFocus
        ? Colors.transparentPurple
        : isDarkMode
        ? Colors.dark2
        : Colors.grey50,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    }),
    [onFocus, value, isDarkMode],
  );
};

const useInputStyle = (
  onFocus: boolean,
  value: string | undefined,
  isDarkMode: boolean,
) => {
  return useStyle(
    () => ({
      color:
        onFocus && isDarkMode
          ? Colors.white
          : onFocus
          ? Colors.grey900
          : value && isDarkMode
          ? Colors.white
          : Colors.grey900,
      flex: 1,
      fontFamily: onFocus || value ? Fonts.semiBold : Fonts.regular,
      fontSize: Sizes.bodyMedium,
      height: '100%',
    }),
    [onFocus, value, isDarkMode],
  );
};

const _Input = forwardRef<InputRef, Props>(
  (
    {
      placeholderText,
      containerStyle,
      inputStyle,
      leftIcon,
      rightIcon,
      onFocusChange,
      ...rest
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const { isDarkMode } = useApp();

    const [isFocused, setIsFocused] = useState(false);

    const _containerStyle = useContainerStyle(
      isFocused,
      rest.value,
      isDarkMode,
    );
    const _inputStyle = useInputStyle(isFocused, rest.value, isDarkMode);

    const handleFocusChange = useCallback((focus: boolean) => {
      setIsFocused(focus);
      if (typeof onFocusChange === 'function') onFocusChange(focus);
    }, []);

    return (
      <View style={[_containerStyle, containerStyle]}>
        {leftIcon}
        <TextInput
          ref={ref}
          enablesReturnKeyAutomatically
          onFocus={() => handleFocusChange(true)}
          onBlur={() => handleFocusChange(false)}
          style={[inputStyle, _inputStyle]}
          placeholder={t(String(placeholderText)).toString()}
          autoCorrect={false}
          blurOnSubmit={false}
          placeholderTextColor={Colors.grey500}
          {...rest}
        />
        {rightIcon}
      </View>
    );
  },
);

export default memo(_Input);
