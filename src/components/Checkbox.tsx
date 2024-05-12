import { Pressable } from 'react-native';
import React, { memo, useCallback, useState } from 'react';

import { useStyle } from '@app/hooks';
import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import { Icon } from '@app/components';

type Props = {
  checked?: boolean;
  onFocusChange?: (focused: boolean) => void;
};

const BOX_SIZE = rs(24);

const useCheckboxStyle = (checked: boolean) => {
  return useStyle(
    () => ({
      width: BOX_SIZE,
      height: BOX_SIZE,
      borderRadius: 8,
      borderWidth: 3,
      borderColor: Colors.primary500,
      backgroundColor: checked ? Colors.primary500 : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    }),
    [checked],
  );
};

const _Checkbox = ({ checked = false, onFocusChange }: Props) => {
  const [isCheck, setIsCheck] = useState<boolean>(checked);
  const style = useCheckboxStyle(isCheck);

  const onChangeCheck = useCallback(() => {
    setIsCheck((previousState) => {
      if (typeof onFocusChange === 'function') onFocusChange(!previousState);
      return !previousState;
    });
  }, []);

  return (
    <Pressable style={style} onPress={onChangeCheck}>
      {isCheck && <Icon icon="checked" size={rs(12)} color={Colors.white} />}
    </Pressable>
  );
};

export default memo(_Checkbox);
