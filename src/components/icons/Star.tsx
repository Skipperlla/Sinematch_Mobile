import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg width={28} height={29} fill="none" viewBox="0 0 28 29" {...props}>
    <Path
      fill="url(#a)"
      d="M20.904 17.309a1.284 1.284 0 0 0-.372 1.131l1.037 5.74a1.26 1.26 0 0 1-.525 1.26c-.399.292-.93.327-1.365.094l-5.167-2.695a1.32 1.32 0 0 0-.583-.153h-.317a.945.945 0 0 0-.315.105L8.13 25.499c-.255.128-.545.174-.828.128a1.297 1.297 0 0 1-1.039-1.483l1.039-5.74a1.305 1.305 0 0 0-.372-1.142l-4.213-4.083a1.26 1.26 0 0 1-.314-1.319 1.31 1.31 0 0 1 1.037-.875l5.798-.84a1.297 1.297 0 0 0 1.027-.711l2.555-5.239c.06-.116.139-.224.233-.315l.105-.081a.782.782 0 0 1 .188-.152l.127-.047.199-.081h.49c.44.045.826.308 1.028.7l2.588 5.215c.187.381.55.646.969.71l5.798.841c.49.07.9.409 1.062.875.153.468.02.982-.339 1.319l-4.363 4.13Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={25.668}
        x2={-1.869}
        y1={25.687}
        y2={17.282}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#FACC15" />
        <Stop offset={1} stopColor="#FFE580" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default React.memo(SvgComponent);
