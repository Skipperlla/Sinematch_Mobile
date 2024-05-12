import { View, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';
import { useRoute } from '@react-navigation/native';

import { Button, Text } from '@app/components';
import { rs } from '@app/utils';
import { useAppNavigation } from '@app/hooks';
import { Pages } from '@app/constants';
import type { RootRouteProps } from '@app/types/navigation';

const ActionButtons = () => {
  const { params } = useRoute<RootRouteProps<Pages.Matched>>();
  const navigation = useAppNavigation();

  const navigate = useCallback(() => {
    navigation.goBack();
    navigation.navigate(Pages.Chat_Details, {
      conversationId: params?.conversationId,
      receiverId: params?.receiverId,
      receiverFullName: params?.receiverFullName,
      discoveryId: params?.discoveryId,
    });
  }, []);
  return (
    <>
      <View style={styles.textContainer}>
        <Text
          text="screens.matched.title"
          size="h1"
          align="center"
          fontFamily="pacificoRegular"
          color="primary500"
          style={styles.title}
        />
        <Text
          text="screens.matched.subTitle"
          size="bodyXLarge"
          align="center"
          fontFamily="medium"
          style={styles.subTitle}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button text="screens.matched.sayHello" shadow onPress={navigate} />
        <Button
          text="screens.matched.keepSwiping"
          variant="secondary"
          onPress={navigation.goBack}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    marginBottom: rs(47),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { letterSpacing: -0.03 },
  subTitle: {
    letterSpacing: 0.2,
  },
  buttonContainer: {
    gap: rs(24),
  },
});

export default ActionButtons;
