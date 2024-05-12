import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const SvgComponent = (
  props: SvgProps & {
    firstStopColor?: string;
    secondStopColor?: string;
  },
) => (
  <Svg width={24} height={24} viewBox="0 0 110 110" fill="none" {...props}>
    <Path
      fill="url(#a)"
      d="M19.352 74.861 9.167 18.843l28.01 25.463L55 13.75l17.824 30.556 28.01-25.463L90.648 74.86H19.352ZM90.65 90.14c0 3.055-2.038 5.093-5.093 5.093H24.445c-3.056 0-5.093-2.038-5.093-5.093v-5.093H90.65v5.093Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={100.834}
        x2={-6.04}
        y1={95.231}
        y2={60.371}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor={props.firstStopColor} />
        <Stop offset={1} stopColor={props.secondStopColor} />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default React.memo(SvgComponent);
