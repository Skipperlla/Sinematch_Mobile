import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';

import { FastImage } from '@app/components';
import { rs, swiperConfig } from '@app/utils';
import { Pages, ScreenSizes, SubscribePlan } from '@app/constants';
import {
  useAppNavigation,
  useDiscovery,
  useUser,
  useTranslation,
} from '@app/hooks';

import Info from './Info';

type Props = {
  uri: string;
  fullName: string;
  age: number;
  receiverId: string;
  discoveryId: string;
  onLayoutAnimation: () => void;
};

const _IgnoredCard = ({
  uri,
  fullName,
  age,
  receiverId,
  discoveryId,
  onLayoutAnimation,
}: Props) => {
  const { t } = useTranslation();
  const { setIgnored, undoUserAction } = useDiscovery();
  const { User } = useUser();
  const navigation = useAppNavigation();

  const navigate = useCallback(() => navigation.navigate(Pages.Subscribe), []);
  async function undoUser() {
    try {
      const { user } = await undoUserAction({ receiverId, discoveryId });
      onLayoutAnimation();
      navigation.navigate(Pages.Swipe_Back, {
        user,
        userId: String(user.uuid),
      });
    } catch {
      onLayoutAnimation();
      setIgnored(discoveryId);
    }
  }
  async function handleUndoUser() {
    Alert.alert(
      t('components.card.ignoredCard.takeItBack'),
      String(t('components.card.ignoredCard.takeItBackDescription')),
      [
        {
          text: String(t('components.card.ignoredCard.cancel')),
          style: 'cancel',
        },
        {
          text: String(t('components.card.ignoredCard.takeItBack')),

          onPress: User.plan === SubscribePlan.FREE ? navigate : undoUser,
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleUndoUser}
        activeOpacity={1}
        style={styles.containerButton}
      >
        <Info fullName={fullName} age={String(age)} />
        <FastImage uri={uri} width="100%" height={244} borderRadius={28} />
        <LinearGradient
          pointerEvents="none"
          colors={swiperConfig.baseGradientColor}
          style={styles.linearGradient}
          start={{ x: 0.5, y: 0.0 }}
          locations={[0.5781, 0.7719, 1]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    borderRadius: 28,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  container: {
    marginBottom: rs(20),
    width: ScreenSizes.screenWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerButton: {
    width: rs(180),
  },
});

export default memo(_IgnoredCard);
