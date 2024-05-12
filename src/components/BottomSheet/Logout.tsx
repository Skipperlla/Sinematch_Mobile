import { StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

import { rs } from '@app/utils';
import { Text, Button } from '@app/components';
import { Colors } from '@app/styles';
import { useApp, useConversation, useDiscovery, useUser } from '@app/hooks';

const _Logout = () => {
  const { isDarkMode } = useApp();
  const { bottom } = useSafeAreaInsets();
  const { dismissAll } = useBottomSheetModal();
  const { logoutAction } = useUser();
  const { resetInitialState: resetInitialStateConversation } =
    useConversation();
  const { resetInitialState: resetInitialStateDiscovery } = useDiscovery();

  async function handleLogout() {
    dismissAll();
    resetInitialStateConversation();
    resetInitialStateDiscovery();
    await logoutAction();
  }

  return (
    <View
      style={[
        {
          marginBottom: rs(bottom || 24),
        },
        styles.container,
      ]}
    >
      <View
        style={[
          styles.titleContainer,
          {
            borderBottomColor: isDarkMode ? Colors.dark3 : Colors.grey200,
          },
        ]}
      >
        <Text
          fontFamily="bold"
          size="h5"
          color="error"
          text="components.bottomSheet.logout.title"
          align="center"
        />
      </View>
      <Text
        fontFamily="bold"
        size="h6"
        text="components.bottomSheet.logout.subTitle"
        align="center"
        style={styles.subTitle}
      />
      <View style={styles.buttonContainer}>
        <Button
          text="components.bottomSheet.logout.cancel"
          variant="secondary"
          style={styles.button}
          onPress={dismissAll}
        />
        <Button
          shadow
          style={styles.button}
          onPress={handleLogout}
          text="components.bottomSheet.logout.logout"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: rs(24),
  },
  titleContainer: {
    marginVertical: rs(24),
    borderBottomWidth: 1,
    paddingBottom: rs(24),
  },
  subTitle: {
    marginBottom: rs(24),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: rs(10),
  },
  button: {
    flex: 1,
  },
});

export default memo(_Logout);
