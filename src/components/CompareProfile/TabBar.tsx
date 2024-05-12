import { View, TouchableOpacity, Platform } from 'react-native';
import React, { memo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppNavigation, useStyle } from '@app/hooks';
import { rs } from '@app/utils';
import { Icon } from '@app/components';
import { Pages } from '@app/constants';

type Props = {
  onShowSettings?: () => void;
  isModalVisible: boolean;
  showMoreCircle?: boolean;
};

const _TabBar = ({
  onShowSettings,
  isModalVisible,
  showMoreCircle = true,
}: Props) => {
  const { top } = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const style = useStyle(
    () => ({
      position: 'absolute',
      width: '100%',
      zIndex: 1,
      paddingHorizontal: rs(24),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }),
    [],
  );

  const navigate = useCallback(() => {
    navigation.navigate(Pages.Single_Edit_Profile, {
      editType: 'Avatars',
    });
  }, []);

  return (
    <View
      pointerEvents="box-none"
      style={[
        style,
        {
          paddingTop: Platform.OS === 'ios' ? top : top + 15,
        },
      ]}
    >
      <TouchableOpacity onPress={navigation.goBack} disabled={isModalVisible}>
        <Icon icon="light_outline_arrow_left" size={rs(32)} color="white" />
      </TouchableOpacity>
      {showMoreCircle ? (
        <TouchableOpacity disabled={isModalVisible} onPress={onShowSettings}>
          <Icon icon="light_outline_more_circle" size={rs(32)} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity disabled={isModalVisible} onPress={navigate}>
          <Icon icon="curved_edit" size={rs(32)} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(_TabBar);
