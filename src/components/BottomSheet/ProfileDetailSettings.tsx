import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

import { Icon, Text } from '@app/components';
import { Colors } from '@app/styles';
import { rs } from '@app/utils';
import { useApp, useTranslation } from '@app/hooks';
import { UserService } from '@app/api';

type Props = {
  onBlockUser: () => void;
  userId: string;
};

const _ProfileDetailSettings = ({ onBlockUser, userId }: Props) => {
  const { isDarkMode } = useApp();
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();

  const { data } = useQuery(
    [userId],
    () => UserService.compareProfile(userId),
    {
      enabled: false,
    },
  );

  const onShowModal = useCallback(
    () =>
      Alert.alert(
        t('components.bottomSheet.profileDetailSettings.title', {
          fullName: data?.receiver?.fullName,
        }),
        String(
          t('components.bottomSheet.profileDetailSettings.subTitle', {
            fullName: data?.receiver?.fullName,
          }),
        ),
        [
          {
            text: String(
              t('components.bottomSheet.profileDetailSettings.cancel'),
            ),
            style: 'cancel',
          },
          {
            text: String(
              t('components.bottomSheet.profileDetailSettings.block'),
            ),
            onPress: onBlockUser,
            style: 'destructive',
          },
        ],
        { cancelable: false },
      ),
    [],
  );

  return (
    <View
      style={[
        styles.container,
        {
          marginBottom: bottom ?? 24,
        },
      ]}
    >
      <TouchableOpacity style={styles.button} onPress={onShowModal}>
        <Text
          text="components.bottomSheet.profileDetailSettings.blockUser"
          fontFamily="medium"
          size="bodyLarge"
        />
        <Icon
          icon="light_arrow_right_2"
          color={isDarkMode ? Colors.white : Colors.grey900}
          size={rs(24)}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rs(24),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: rs(16),
  },
});

export default memo(_ProfileDetailSettings);
