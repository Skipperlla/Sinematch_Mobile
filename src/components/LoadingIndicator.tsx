import React, { memo } from 'react';
import { View, ActivityIndicator, ViewStyle } from 'react-native';

import { useApp, useStyle } from '@app/hooks';

type Props = {
  style?: ViewStyle;
};

const _LoadingIndicator = ({ style }: Props) => {
  const { isDarkMode } = useApp();
  const _style = useStyle(
    () => ({ flex: 1, alignItems: 'center', justifyContent: 'center' }),
    [],
  );

  return (
    <View style={[_style, style]}>
      <ActivityIndicator color={isDarkMode ? 'white' : 'black'} />
    </View>
  );
};

export default memo(_LoadingIndicator);
