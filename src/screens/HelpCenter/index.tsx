import React from 'react';
import { Linking } from 'react-native';

import { SettingsContainer, HelpCenterButton } from '@app/components';
import { useAppNavigation } from '@app/hooks';
import { Pages } from '@app/constants';

const Index = () => {
  const navigation = useAppNavigation();
  const helpers = [
    {
      label: 'screens.helpCenter.privacyPolicy',
      func: () => navigation.navigate(Pages.Privacy_Policy),
    },
    {
      label: 'screens.helpCenter.termsOfService',
      func: () => navigation.navigate(Pages.Terms_Of_Service),
    },
    {
      label: 'screens.helpCenter.contactUs',
      func: () => Linking.openURL('mailto:info@sinematch.com'),
    },
  ];

  return (
    <SettingsContainer title="screens.helpCenter.title">
      {helpers.map((item, index) => {
        return (
          <HelpCenterButton key={index} label={item.label} func={item.func} />
        );
      })}
    </SettingsContainer>
  );
};

export default Index;
