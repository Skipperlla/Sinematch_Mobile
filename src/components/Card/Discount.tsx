import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React, { memo, useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';

import { Text } from '@app/components';
import { rs } from '@app/utils';
import * as Icons from '@app/components/icons';
import { Colors } from '@app/styles';
import {
  useAppNavigation,
  usePurchase,
  useTranslation,
  useUser,
} from '@app/hooks';
import { Pages } from '@app/constants';

const _Discount = () => {
  const navigation = useAppNavigation();
  const { purchaserInfo } = usePurchase();
  const { t } = useTranslation();
  const { User } = useUser();

  const navigate = useCallback(() => navigation.navigate(Pages.Subscribe), []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradientPurple}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 1]}
        style={styles.linearGradientContainer}
      >
        <View style={{ ...StyleSheet.absoluteFillObject }}>
          <Icons.Cube />
        </View>
        <View style={styles.textContainer}>
          <Text
            fontFamily="bold"
            size="h5"
            text={
              User.plan === 2
                ? 'components.card.subscribeCard.premiumTitle'
                : 'components.card.subscribeCard.title'
            }
            color="white"
          />
          <Text
            fontFamily="regular"
            size="bodySmall"
            color="white"
            text={
              User.plan === 2
                ? t('components.card.subscribeCard.premiumExpired', {
                    date: dayjs(
                      purchaserInfo?.allExpirationDates?.[
                        purchaserInfo?.activeSubscriptions?.[0]
                      ],
                    ).format('LL'),
                  })
                : 'components.card.subscribeCard.description'
            }
          />

          {User.plan !== 2 && (
            <TouchableOpacity style={styles.button} onPress={navigate}>
              <Text
                fontFamily="semiBold"
                color="primary500"
                size="bodyMedium"
                text="components.card.subscribeCard.button"
              />
            </TouchableOpacity>
          )}
        </View>

        <Icons.Crown
          width={75}
          height={75}
          firstStopColor={Colors.gradientYellow[0]}
          secondStopColor={Colors.gradientYellow[1]}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: Colors.primary500,
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 16,
    width: '100%',
    marginBottom: rs(24),
  },
  linearGradientContainer: {
    padding: rs(24),
    marginHorizontal: rs(24),
    borderRadius: 40,
    alignItems: 'center',
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    gap: rs(12),
    marginRight: rs(12),
  },
  button: {
    paddingVertical: rs(6),
    alignItems: 'center',
    borderRadius: 999,
    width: rs(100),
    backgroundColor: Colors.white,
  },
});

export default memo(_Discount);
