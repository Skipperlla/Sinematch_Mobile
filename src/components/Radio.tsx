import { TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';

import { useStyle } from '@app/hooks';
import { Colors } from '@app/styles';

type Props = {
  width?: number;
  height?: number;
  ellipseSize?: number;
  checked: boolean;
} & TouchableOpacity['props'];

const BOX_SIZE = 24;
const ELLIPSE_SIZE = 14;

const useRadioStyle = (width: number, height: number) => {
  return useStyle(
    () => ({
      width: width,
      height: height,
      borderRadius: 999,
      borderWidth: 3,
      borderColor: Colors.primary500,
      justifyContent: 'center',
      alignItems: 'center',
    }),
    [],
  );
};

const useEllipseStyle = (ellipseSize: number) => {
  return useStyle(
    () => ({
      width: ellipseSize,
      height: ellipseSize,
      borderRadius: 999,
      backgroundColor: Colors.primary500,
    }),
    [],
  );
};

const _Radio = ({
  width = BOX_SIZE,
  height = BOX_SIZE,
  ellipseSize = ELLIPSE_SIZE,
  checked,
  ...rest
}: Props) => {
  const style = useRadioStyle(width, height);
  const ellipseStyle = useEllipseStyle(ellipseSize);

  return (
    <TouchableOpacity activeOpacity={1} style={style} {...rest}>
      {checked && <View style={ellipseStyle} />}
    </TouchableOpacity>
  );
};

export default memo(_Radio);
