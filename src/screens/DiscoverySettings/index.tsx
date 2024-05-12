import React, { useState } from 'react';
import { useNotify } from 'rn-notify';

import { Button, SettingsContainer } from '@app/components';
import { DiscoveryContext, lib } from '@app/utils';
import {
  useAppNavigation,
  useDiscovery,
  useUser,
  useTranslation,
} from '@app/hooks';
import type { DiscoverySettingsProps } from '@app/types/redux/user';

import GenderPreference from './GenderPreference';
import MatchType from './MatchType';
import AgeRange from './AgeRange';

const Index = () => {
  const { User } = useUser();
  const { discoverySettingsAction, isLoading } = useUser();
  const { allDiscoveriesAction } = useDiscovery();
  const { setCurrentIndex, currentUserId, swipeBack, userIndex } =
    DiscoveryContext.useDiscovery();
  const { t } = useTranslation();
  const navigation = useAppNavigation();
  const notify = useNotify();

  const [discoverySettings, setDiscoverySettings] =
    useState<DiscoverySettingsProps>({
      ...User.discoverySettings,
      ageRange: {
        min: lib.ageCalc(User?.discoverySettings?.ageRange?.max),
        max: lib.ageCalc(User?.discoverySettings?.ageRange?.min),
      },
    });
  function handleChangeData() {
    discoverySettingsAction({
      ...discoverySettings,
      ageRange: {
        min: lib.getBirthDateFromAge(Number(discoverySettings.ageRange?.max)),
        max: lib.getBirthDateFromAge(Number(discoverySettings.ageRange?.min)),
      },
    }).then(() =>
      allDiscoveriesAction().then(() => {
        setCurrentIndex(0);
        currentUserId.value = '';
        userIndex.value = 1;
        swipeBack.value = false;
        notify.success({
          message: t('screens.discoverySettings.filteredUsers'),
          duration: 3000,
        });
        navigation.goBack();
      }),
    );
  }

  return (
    <SettingsContainer title="screens.discoverySettings.title">
      <MatchType
        setDiscoverySettings={setDiscoverySettings}
        discoverySettings={discoverySettings}
      />
      <GenderPreference
        setDiscoverySettings={setDiscoverySettings}
        discoverySettings={discoverySettings}
      />
      <AgeRange setDiscoverySettings={setDiscoverySettings} />
      <Button
        shadow
        text="screens.discoverySettings.applyFilter"
        onPress={handleChangeData}
        isLoading={isLoading}
        disabled={isLoading}
      />
    </SettingsContainer>
  );
};

export default Index;
