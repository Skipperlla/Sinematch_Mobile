import { ActivityIndicator } from 'react-native';
import React, { memo, useCallback, useState } from 'react';
import FastImage, { Priority, ResizeMode } from 'react-native-fast-image';

import { Colors } from '@app/styles';
import { useApp, useStyle } from '@app/hooks';
import { rs } from '@app/utils';
import { Icon } from '@app/components';

type Props = {
  uri: string;
  width: number | string;
  height: number | string;
  priority?: Priority;
  resizeMode?: ResizeMode;
  borderRadius?: number;
  // TODO: Fix any type
  styles?: any;
  loadingIndicatorColor?: string;
  useRS?: boolean;
};

const useFastImageStyle = (
  width: number | string,
  height: number | string,
  borderRadius?: number,
  useRS: boolean = true,
) => {
  return useStyle(
    () => ({
      width: typeof width === 'number' ? (useRS ? rs(width) : width) : width,
      height:
        typeof height === 'number' ? (useRS ? rs(height) : height) : height,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius,
    }),
    [],
  );
};

const _FastImage = ({
  width,
  height,
  uri,
  priority = FastImage.priority.normal,
  resizeMode = FastImage.resizeMode.cover,
  borderRadius,
  styles,
  loadingIndicatorColor,
  //* useRS = ResponsiveSize
  useRS = true,
}: Props) => {
  const { isDarkMode } = useApp();
  const [onLoad, setOnLoad] = useState<boolean>(true);
  const style = useFastImageStyle(width, height, borderRadius, useRS);

  const onLoadStart = useCallback(() => setOnLoad(true), []);
  const onLoadEnd = useCallback(() => setOnLoad(false), []);

  return (
    <FastImage
      style={[style, styles]}
      source={{
        uri,
        priority,
      }}
      onLoadEnd={onLoadEnd}
      onLoadStart={onLoadStart}
      resizeMode={resizeMode}
    >
      {onLoad && (
        <ActivityIndicator
          size="small"
          color={
            loadingIndicatorColor
              ? loadingIndicatorColor
              : isDarkMode
              ? Colors.white
              : Colors.black
          }
        />
      )}
      {!uri && (
        <Icon icon="image_outline" size={rs(26)} color={Colors.primary500} />
      )}
    </FastImage>
  );
};

export default memo(_FastImage);
