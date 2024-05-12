import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';

import { useApp } from '@app/hooks';
import { Colors } from '@app/styles';

const SvgComponent = (props: SvgProps) => {
  const { isDarkMode } = useApp();

  return (
    <Svg width={29} height={28} fill="none" {...props}>
      <G
        stroke={isDarkMode ? Colors.white : Colors.grey900}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        clipPath="url(#a)"
      >
        <Path d="M23.667 7a1.167 1.167 0 0 1 1.167 1.167v11.666A1.167 1.167 0 0 1 23.667 21H10.834L5 15.167a1.75 1.75 0 0 1 0-2.334L10.834 7h12.833Z" />
        <Path d="m19 11.667-4.666 4.666m0-4.666 4.667 4.666-4.667-4.666Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M.334 0h28v28h-28z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default React.memo(SvgComponent);
