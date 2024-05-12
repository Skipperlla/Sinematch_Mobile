import * as React from 'react';
import Svg, { SvgProps, G, Path } from 'react-native-svg';
import { memo } from 'react';

const SvgComponent = (props: SvgProps) => (
  <Svg width="100%" height="100%" fill="none" {...props}>
    <G fill="#fff" filter="url(#a)" opacity={0.5}>
      <Path
        d="m242.831-32.36 128.306 76.37v129.128L242.831 96.076V-32.361Z"
        opacity={0.1}
      />
      <Path
        d="m498.993-32.284-128.302 76.29V173l128.302-76.982V-32.284Z"
        opacity={0.2}
      />
      <Path
        d="M242.831-31.938 371.137-109l128.305 77.062v.576L371.137 45.7 242.831-31.362v-.576Z"
        opacity={0.3}
      />
      <Path
        d="m-119 40.894 128.306 76.37v129.128L-119 169.33V40.894Z"
        opacity={0.1}
      />
      <Path
        d="M137.162 40.97 8.86 117.262v128.993l128.302-76.981V40.971Z"
        opacity={0.2}
      />
      <Path
        d="M-119 41.316 9.306-35.746 137.61 41.316v.577L9.306 118.955-119 41.893v-.577Z"
        opacity={0.3}
      />
      <Path
        d="m189.111-.24 53.498 31.844v53.84l-53.498-32.13V-.24Z"
        opacity={0.1}
      />
      <Path
        d="m295.919-.207-53.496 31.81v53.784l53.496-32.098V-.207Z"
        opacity={0.2}
      />
      <Path
        d="m189.111-.063 53.498-32.131L296.107-.063v.24L242.609 32.31 189.111.177v-.24ZM233.951 205.492l53.498-32.131 53.498 32.131v.241l-53.498 32.131-53.498-32.131v-.241Z"
        opacity={0.3}
      />
    </G>
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
