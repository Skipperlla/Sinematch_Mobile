import React, { useState } from 'react';
import { View } from 'react-native';

import { GenderCard } from '@app/components';
import { useUser, useAccountSetup, useStyle } from '@app/hooks';
import { rs } from '@app/utils';
import type { EGendersPreferences } from '@app/types/redux/user';

import Layout from './Layout';

const genders = [
  {
    text: 'screens.signUp.gender.male',
    value: 1,
    icon: 'male_outline',
  },
  {
    text: 'screens.signUp.gender.female',
    value: 2,
    icon: 'female_outline',
  },
  {
    text: 'screens.signUp.genderPreference.both',
    value: 3,
    icon: 'light_3_user',
  },
];

const GenderPreference = () => {
  const { User, discoverySettingsAction } = useUser();
  const { nextPage } = useAccountSetup();
  const [genderPreference, setGenderPreference] =
    useState<EGendersPreferences | null>(
      User.discoverySettings?.genderPreference || null,
    );
  const style = useStyle(
    () => ({
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
    }),
    [],
  );

  function onPress() {
    if (typeof genderPreference === 'number')
      discoverySettingsAction({
        ...User.discoverySettings,
        genderPreference,
      }).then(nextPage);
  }

  return (
    <Layout
      title="screens.signUp.genderPreference.title"
      onPress={onPress}
      isDisabled={typeof genderPreference !== 'number'}
    >
      <View style={style}>
        {genders.map((item, index) => {
          return (
            <GenderCard
              key={index}
              style={{
                marginTop: index === genders.length - 1 ? rs(20) : 0,
              }}
              onPress={() => setGenderPreference(item.value)}
              selected={genderPreference === item.value}
              text={item.text}
              icon={item.icon}
            />
          );
        })}
      </View>
    </Layout>
  );
};

export default GenderPreference;
