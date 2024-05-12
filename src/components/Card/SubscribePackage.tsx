import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';
import { PurchasesPackage } from 'react-native-purchases';
import Animated, { FadeIn } from 'react-native-reanimated';

import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import { usePurchase, useTranslation } from '@app/hooks';
import { Text } from '@app/components';

type Props = {
  pack: PurchasesPackage;
  title: string;
  identifier: string;
  priceString: string;
  pricePerMonth: string;
  currentSelectedIdentifier: boolean;
  setCurrentIdentifier: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setCurrentPackage: React.Dispatch<React.SetStateAction<PurchasesPackage>>;
  index: number;
};

const _SubscribePackage = ({
  priceString,
  pack,
  title,
  identifier,
  setCurrentIdentifier,
  currentSelectedIdentifier,
  pricePerMonth,
  setCurrentPackage,
  index,
}: Props) => {
  const { t } = useTranslation();
  const { isPurchaseLoading } = usePurchase();

  return (
    <Animated.View key={index} entering={FadeIn.delay(index * 200)}>
      <TouchableOpacity
        activeOpacity={1}
        style={[
          styles.container,
          {
            borderColor: currentSelectedIdentifier
              ? Colors.primary500
              : Colors.grey200,
          },
        ]}
        disabled={isPurchaseLoading}
        onPress={() => {
          setCurrentIdentifier(identifier);
          setCurrentPackage(pack);
        }}
      >
        <Text fontFamily="bold" size="bodyMedium" text={title} />
        <View style={styles.priceContainer}>
          <Text
            fontFamily="bold"
            size="bodyMedium"
            align="right"
            text={priceString}
          />

          <Text
            fontFamily="medium"
            size="bodyXSmall"
            color="grey500"
            align="right"
            text={t('components.card.subscribeCard.month', {
              price: pricePerMonth,
            })}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: rs(24),
    borderWidth: 2,
    borderRadius: 48,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceContainer: {
    gap: rs(2),
  },
});

export default memo(_SubscribePackage);
