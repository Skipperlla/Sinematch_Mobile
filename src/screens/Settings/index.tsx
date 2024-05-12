import React, { useCallback } from 'react';
import { Alert } from 'react-native';

import {
  PurchaseLoadingIndicator,
  SettingsButton,
  SettingsContainer,
} from '@app/components';
import { Colors } from '@app/styles';
import { Languages, Pages } from '@app/constants';
import {
  useApp,
  useConversation,
  useDiscovery,
  useUser,
  useTranslation,
  usePurchase,
} from '@app/hooks';

const Index = () => {
  const { defaultLanguage } = useApp();
  const { restorePurchasesAction, fetchPurchaseInfoAction, isPurchaseLoading } =
    usePurchase();
  const { deleteAccountAction, updateProfileAction } = useUser();
  const { resetInitialState: resetInitialStateConversation } =
    useConversation();
  const { resetInitialState: resetInitialStateDiscovery } = useDiscovery();
  const { t } = useTranslation();
  const onDeleteAccount = useCallback(() => {
    Alert.alert(
      String(t('screens.settings.deleteAccountTitle')),
      String(t('screens.settings.deleteAccountDescription')),
      [
        {
          text: String(t('screens.settings.cancel')),
          style: 'cancel',
        },
        {
          text: String(t('screens.settings.delete')),
          style: 'destructive',
          onPress: async () => {
            await deleteAccountAction();
            resetInitialStateConversation();
            resetInitialStateDiscovery();
          },
        },
      ],
    );
  }, []);

  const settings = [
    {
      label: 'personalInformation',
      icon: 'bold_profile',
      background: Colors.gradientPurple,
      page: Pages.Personal_Information,
    },
    {
      label: 'discoverySettings',
      icon: 'bold_discovery',
      background: Colors.gradientOrange,
      page: Pages.Discovery_Settings,
    },
    {
      label: 'notifications',
      icon: 'bold_notification',
      background: Colors.gradientYellow,
      page: Pages.Notifications,
    },
    {
      label: 'blockedUsers',
      icon: 'bold_3_user',
      background: Colors.gradientGreen,
      page: Pages.Blocked_Users,
    },
    {
      label: 'language',
      icon: 'bold_document',
      background: Colors.gradientBlue,
      currentLanguage:
        defaultLanguage === Languages.en ? 'English (US)' : `Türkçe (TR)`,
      page: Pages.Language,
    },
    {
      label: 'deleteAccount',
      icon: 'bold_delete',
      background: Colors.gradientRed,
      func: onDeleteAccount,
    },
    {
      label: 'restorePurchases',
      icon: 'bold_buy',
      background: Colors.gradientCyan,
      disabled: isPurchaseLoading,
      func: () => {
        restorePurchasesAction().then(async (hasActiveSubscription) => {
          await fetchPurchaseInfoAction();
          updateProfileAction({
            plan: hasActiveSubscription ? 2 : 1,
          });
          Alert.alert(
            t('screens.settings.restorePurchasesAlertTitle'),
            hasActiveSubscription
              ? t('screens.settings.restorePurchasesAlertSuccess')
              : t('screens.settings.restorePurchasesAlertError'),
          );
        });
      },
    },
  ];

  return (
    <SettingsContainer title="screens.settings.title">
      {settings.map((setting, index) => {
        return (
          <SettingsButton
            key={index}
            background={setting.background}
            icon={setting.icon}
            label={setting.label}
            currentLanguage={setting.currentLanguage}
            page={setting.page}
            func={setting.func}
            disabled={setting.disabled}
          />
        );
      })}
      <PurchaseLoadingIndicator visible={isPurchaseLoading} />
    </SettingsContainer>
  );
};

export default Index;
