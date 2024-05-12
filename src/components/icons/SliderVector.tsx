import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
const SvgComponent = (props: SvgProps) => (
  <Svg width={28} height={25} viewBox="0 0 28 25" fill="none" {...props}>
    <Path
      fill="url(#a)"
      d="M.879.879C0 1.757 0 3.172 0 6v9c0 2.828 0 4.243.879 5.121C1.757 21 3.172 21 6 21h1.675a7.732 7.732 0 0 1 6.333 3.298c.224.32.336.479.492.479.156 0 .268-.16.492-.48A7.732 7.732 0 0 1 21.325 21H22c2.828 0 4.243 0 5.121-.879C28 19.243 28 17.828 28 15V6c0-2.828 0-4.243-.879-5.121C26.243 0 24.828 0 22 0H6C3.172 0 1.757 0 .879.879Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={28}
        x2={-4.617}
        y1={24.777}
        y2={14.09}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9610FF" />
        <Stop offset={1} stopColor="#AF48FF" />
      </LinearGradient>
    </Defs>
  </Svg>
);
const Memo = React.memo(SvgComponent);
export default Memo;
