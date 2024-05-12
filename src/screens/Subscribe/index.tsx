import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PurchasesPackage } from 'react-native-purchases';
import dayjs from 'dayjs';

import { rs } from '@app/utils';
import {
  Button,
  Icon,
  LoadingIndicator,
  PurchaseLoadingIndicator,
  SubscribePackageCard,
  Text,
} from '@app/components';
import { Colors } from '@app/styles';
import {
  useApp,
  useAppNavigation,
  usePurchase,
  useTimer,
  useUser,
} from '@app/hooks';
import { OfferingsIdentifier } from '@app/store/purchases.slice';
import { Pages } from '@app/constants';

const Subscribe = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { isDarkMode } = useApp();
  const { User, updateProfileAction } = useUser();
  const {
    fetchOfferingsAction,
    packages,
    purchaserInfo,
    isLoading,
    purchasePackageAction,
    isPurchaseLoading,
  } = usePurchase();
  const { timeLeft, isTimeUp } = useTimer(dayjs(User.matchResetCountdown));
  const navigation = useAppNavigation();

  const defaultIdentifier = packages?.find(
    (item) => item.product.identifier === OfferingsIdentifier.Monthly_3,
  );
  const [currentIdentifier, setCurrentIdentifier] = useState(
    purchaserInfo?.activeSubscriptions?.[0] ||
      defaultIdentifier?.product.identifier,
  );

  const defaultPackage = packages?.find(
    (item) => item.product.identifier === currentIdentifier,
  );
  const [currentPackage, setCurrentPackage] = useState<PurchasesPackage>(
    defaultPackage || ({} as PurchasesPackage),
  );

  const footerTexts = [
    {
      text: 'screens.subscribe.privacyPolicy',
      func: () => {
        navigation.navigate(Pages.Privacy_Policy);
      },
    },
    {
      text: 'screens.subscribe.termsOfService',
      func: () => {
        navigation.navigate(Pages.Terms_Of_Service);
      },
    },
  ];

  const onPurchase = useCallback(async () => {
    const data = await purchasePackageAction(currentPackage);
    updateProfileAction({
      plan: data.activeSubscriptions.length ? 2 : 1,
    });
    navigation.goBack();
  }, [currentPackage]);

  useEffect(() => {
    fetchOfferingsAction();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === 'ios' ? top : top + 15,
        },
      ]}
    >
      <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
        <Icon
          icon="light_outline_arrow_left"
          size={rs(32)}
          color={isDarkMode ? Colors.white : Colors.grey900}
        />
      </TouchableOpacity>
      <ScrollView
        bounces={false}
        style={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainerStyle,
          {
            paddingBottom: bottom || rs(24),
          },
        ]}
      >
        <Text
          fontFamily="bold"
          size="h3"
          text="Sinematch Premium"
          color="primary500"
          align="center"
        />

        <Text
          fontFamily="medium"
          size="bodyLarge"
          text="screens.subscribe.description"
          align="center"
        />
        {!isTimeUp && (
          <Text
            fontFamily="medium"
            size="bodyXLarge"
            text={timeLeft}
            align="center"
          />
        )}
        <View style={styles.packageContainer}>
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            packages?.map((item, index) => {
              const newIndex = ((index + 1) * (index + 2)) / 2;
              return (
                <SubscribePackageCard
                  priceString={item.product.priceString}
                  pack={item}
                  title={item.product.title}
                  identifier={item.product.identifier}
                  key={item.identifier}
                  currentSelectedIdentifier={
                    currentIdentifier === item.product.identifier
                  }
                  setCurrentIdentifier={setCurrentIdentifier}
                  pricePerMonth={(item.product.price / newIndex).toFixed(2)}
                  setCurrentPackage={setCurrentPackage}
                  index={index + 1}
                />
              );
            })
          )}
        </View>

        <Text
          fontFamily="medium"
          size="bodySmall"
          text="screens.subscribe.footerTitle"
          align="center"
          letterSpacing={0.2}
        />
        <Button
          text="screens.subscribe.continue"
          shadow
          disabled={isPurchaseLoading}
          isLoading={isPurchaseLoading}
          onPress={onPurchase}
        />
        <View style={styles.footerContainer}>
          {footerTexts.map((item, index) => {
            return (
              <TouchableOpacity onPress={item.func} key={index}>
                <Text
                  fontFamily="semiBold"
                  size="bodySmall"
                  text={item.text}
                  letterSpacing={0.2}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <PurchaseLoadingIndicator visible={isPurchaseLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewStyle: {
    marginTop: rs(24),
  },
  backButton: {
    paddingHorizontal: rs(24),
  },
  contentContainerStyle: {
    gap: rs(16),
    flexGrow: 1,
    paddingHorizontal: rs(24),
  },
  packageContainer: {
    gap: rs(24),
    flex: 1,
    justifyContent: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: rs(24),
    gap: rs(32),
  },
});

export default Subscribe;
