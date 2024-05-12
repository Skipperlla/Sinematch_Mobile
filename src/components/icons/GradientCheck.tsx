import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg width={32} height={32} fill="none" {...props}>
    <Path
      fill="url(#a)"
      d="M14.04 20.074a1 1 0 0 1-1.414 0l-2.977-2.976a1 1 0 0 0-1.414 0l-.471.471a1 1 0 0 0 0 1.414l4.862 4.862a1 1 0 0 0 1.414 0l11.528-11.528a1 1 0 0 0 0-1.415l-.47-.47a1 1 0 0 0-1.415 0l-9.643 9.642Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={26.275}
        x2={4.552}
        y1={24.552}
        y2={16.389}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9610FF" />
        <Stop offset={1} stopColor="#AF48FF" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default React.memo(SvgComponent);
