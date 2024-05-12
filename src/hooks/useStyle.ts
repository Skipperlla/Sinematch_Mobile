import { DependencyList, useMemo } from 'react';
import {
  FlexAlignType,
  FlexStyle,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

const useStyle = <
  TStyle extends ViewStyle | TextStyle | ImageStyle | FlexStyle | FlexAlignType,
  TOutput extends StyleProp<TStyle>,
>(
  styleFactory: () => TOutput,
  deps?: DependencyList,
): TOutput => useMemo(styleFactory, deps);

export default useStyle;
