import { StyleSheet, View } from 'react-native';
import React, { memo, useState } from 'react';

import { useAppNavigation, useUser } from '@app/hooks';
import { Button, GenderCard } from '@app/components';
import { rs } from '@app/utils';
import type { EGendersPreferences } from '@app/types/redux/user';

const genders = [
  {
    text: 'components.singleEditProfile.male',
    value: 1,
    icon: 'male_outline',
  },
  {
    text: 'components.singleEditProfile.female',
    value: 2,
    icon: 'female_outline',
  },
];

const _Gender = () => {
  const { User, updateInfoAction, isLoading } = useUser();
  const navigation = useAppNavigation();
  const [gender, setGender] = useState<EGendersPreferences | null>(
    User?.info?.gender || null,
  );

  function onPress() {
    updateInfoAction({
      gender: gender,
    }).then(navigation.goBack);
  }
  return (
    <View style={styles.container}>
      <View style={styles.genderContainer}>
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
      <View style={styles.button}>
        <Button
          text="components.singleEditProfile.save"
          onPress={onPress}
          disabled={isLoading}
          isLoading={isLoading}
          shadow
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  button: {
    paddingHorizontal: rs(24),
    marginBottom: rs(12),
  },
});

export default memo(_Gender);
