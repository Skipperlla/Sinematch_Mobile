import * as React from 'react';
import Svg, {
  SvgProps,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg width={100} height={101} fill="none" viewBox="0 0 100 101" {...props}>
    <Rect width={100} height={100} y={0.4} fill="url(#a)" rx={50} />
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M24.24 49.893c0-14.446 11.736-26.16 26.213-26.16 14.474 0 26.214 11.714 26.214 26.16 0 14.449-11.738 26.162-26.214 26.162a26.169 26.169 0 0 1-9.223-1.666c-1.129-.423-2.363-.532-3.52-.192l-9.201 2.7c-3.123.92-5.993-2.05-4.962-5.133l2.764-8.276c.42-1.256.302-2.619-.192-3.848a26.056 26.056 0 0 1-1.879-9.747Zm31.36-10.06c.827 0 1.653.117 2.438.38 4.838 1.57 6.58 6.868 5.125 11.5a16.646 16.646 0 0 1-3.944 6.29 50.386 50.386 0 0 1-8.298 6.489l-.328.197-.34-.21a49.91 49.91 0 0 1-8.348-6.489 16.913 16.913 0 0 1-3.946-6.278c-1.481-4.63.262-9.929 5.152-11.526a5.93 5.93 0 0 1 1.165-.274h.157a7.605 7.605 0 0 1 1.101-.078h.145a8.185 8.185 0 0 1 2.4.432h.077a.454.454 0 0 1 .118.077c.29.093.563.197.825.341l.498.223c.12.064.256.162.372.246.075.054.141.102.192.133l.065.038c.112.066.23.134.328.21a8.219 8.219 0 0 1 5.046-1.7Z"
      clipRule="evenodd"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={100}
        x2={-18.991}
        y1={100.4}
        y2={65.9}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9610FF" />
        <Stop offset={1} stopColor="#AF48FF" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default React.memo(SvgComponent);
