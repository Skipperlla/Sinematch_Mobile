import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React, { memo } from 'react';

import { rs } from '@app/utils';
import { Icon, Text } from '@app/components';
import { Colors } from '@app/styles';

type Props = {
  backgroundColor: string;
  icon: string;
  label: string;
  onPress: () => void;
};

const _Attachment = ({ backgroundColor, icon, label, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View
        style={[
          styles.buttonContainer,
          {
            backgroundColor,
          },
        ]}
      >
        <Icon icon={icon} size={rs(72 / 2)} color={Colors.white} />
      </View>
      <Text text={label} fontFamily="semiBold" size="bodyLarge" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttonContainer: {
    width: rs(72),
    height: rs(72),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: rs(8),
  },
});

export default memo(_Attachment);
