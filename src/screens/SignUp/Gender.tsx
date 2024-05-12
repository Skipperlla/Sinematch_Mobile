import React, { useState } from 'react';
import { View } from 'react-native';

import { GenderCard } from '@app/components';
import { useUser, useAccountSetup, useStyle } from '@app/hooks';
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
];

const Gender = () => {
  const { User, registerAction } = useUser();
  const { nextPage } = useAccountSetup();
  const [gender, setGender] = useState<EGendersPreferences | null>(
    User?.info?.gender || null,
  );
  const style = useStyle(
    () => ({
      flexDirection: 'row',
      justifyContent: 'space-around',
    }),
    [],
  );

  function onPress() {
    if (typeof gender === 'number')
      registerAction({
        info: {
          ...User?.info,
          gender,
        },
      }).then(nextPage);
  }

  return (
    <Layout
      title="screens.signUp.gender.title"
      onPress={onPress}
      isDisabled={typeof gender !== 'number'}
    >
      <View style={style}>
        {genders.map((item, index) => {
          return (
            <GenderCard
              key={index}
              onPress={() => setGender(item.value)}
              selected={gender === item.value}
              text={item.text}
              icon={item.icon}
            />
          );
        })}
      </View>
    </Layout>
  );
};

export default Gender;
