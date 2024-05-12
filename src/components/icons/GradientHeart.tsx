import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg width={40} height={41} fill="none" viewBox="0 0 40 41" {...props}>
    <Path
      fill="url(#a)"
      fillRule="evenodd"
      d="M26.415 4.77c1.052 0 2.102.148 3.1.483 6.152 2 8.369 8.75 6.517 14.65a21.213 21.213 0 0 1-5.015 8.015 64.091 64.091 0 0 1-10.552 8.267l-.416.251-.434-.268A63.486 63.486 0 0 1 9 27.901a21.555 21.555 0 0 1-5.018-7.998c-1.883-5.9.333-12.65 6.552-14.685a7.534 7.534 0 0 1 1.481-.348h.2c.469-.069.934-.1 1.4-.1h.184c1.05.031 2.066.215 3.051.55h.099a.58.58 0 0 1 .15.098c.368.118.716.252 1.05.435l.633.283c.153.082.325.207.473.314.094.069.18.13.244.17l.082.048c.143.084.292.17.418.267a10.438 10.438 0 0 1 6.416-2.165Zm4.434 12a1.37 1.37 0 0 0 1.316-1.269v-.198c.05-2.335-1.365-4.45-3.516-5.267-.684-.235-1.434.134-1.684.834-.233.7.134 1.466.834 1.715 1.068.4 1.783 1.451 1.783 2.616v.052c-.032.382.083.75.317 1.033.233.284.583.449.95.484Z"
      clipRule="evenodd"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={36.666}
        x2={-2.669}
        y1={36.436}
        y2={24.431}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#FF4D67" />
        <Stop offset={1} stopColor="#FF8A9B" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default React.memo(SvgComponent);
