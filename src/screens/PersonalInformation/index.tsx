import React from 'react';
import { ScrollView } from 'react-native';

import { PersonalInformationButton, SettingsContainer } from '@app/components';
import { useStyle, useUser } from '@app/hooks';
import * as Icons from '@app/components/icons';
import { Colors } from '@app/styles';
import { rs } from '@app/utils';

const Index = () => {
  const { User } = useUser();
  const style = useStyle(() => ({ gap: rs(28), paddingBottom: rs(42) }), []);
  const personalInformation = [
    {
      value: User.fullName,
    },
    {
      value: User.userName,
    },
    {
      value: User.email,
    },
    {
      value: User.info?.biography,
    },
    {
      value: User.info?.gender,
    },
    {
      value: User.info?.birthday,
      isBirthday: true,
    },
    {
      value:
        User.plan === 1
          ? 'screens.personalInformation.1'
          : 'screens.personalInformation.2',
      icon: User.plan === 2 && (
        <Icons.Crown
          firstStopColor={Colors.gradientPurple[0]}
          secondStopColor={Colors.gradientPurple[1]}
        />
      ),
    },
  ];

  return (
    <SettingsContainer title="screens.personalInformation.title">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style}
      >
        {personalInformation.map((item, index) => {
          return (
            <PersonalInformationButton
              key={index}
              isBirthday={item.isBirthday}
              value={item.value}
              icon={item.icon}
            />
          );
        })}
      </ScrollView>
    </SettingsContainer>
  );
};

export default Index;
