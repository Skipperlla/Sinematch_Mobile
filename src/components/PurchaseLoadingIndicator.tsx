import { View, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import React, { memo } from 'react';

import { rs } from '@app/utils';

type Props = {
  visible: boolean;
};

const _PurchaseLoadingIndicator = ({ visible }: Props) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.container}>
        <View style={styles.backdrop}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    padding: rs(50),
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
});

export default memo(_PurchaseLoadingIndicator);
