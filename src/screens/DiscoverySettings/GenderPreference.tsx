import { View, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';

import { DiscoverySettingsButton, Text } from '@app/components';
import { rs } from '@app/utils';
import type { DiscoverySettingsProps } from '@app/types/redux/user';

const genderPreferences = [
  {
    label: 'screens.discoverySettings.male',
    value: 1,
  },
  {
    label: 'screens.discoverySettings.female',
    value: 2,
  },
  {
    label: 'screens.discoverySettings.both',
    value: 3,
  },
];

type Props = {
  setDiscoverySettings: React.Dispatch<
    React.SetStateAction<DiscoverySettingsProps>
  >;
  discoverySettings: DiscoverySettingsProps;
};

const GenderPreference = ({
  setDiscoverySettings,
  discoverySettings,
}: Props) => {
  const onSetGenderPreference = useCallback(
    (value: number) =>
      setDiscoverySettings((prev) => {
        if (prev.genderPreference === value) return prev;

        return { ...prev, genderPreference: value };
      }),
    [],
  );

  return (
    <View style={styles.container}>
      <Text
        text="screens.discoverySettings.genderPreference"
        fontFamily="bold"
        size="h5"
        style={styles.title}
      />
      <View style={styles.buttonContainer}>
        {genderPreferences.map((item, index) => {
          return (
            <DiscoverySettingsButton
              key={index}
              isEqual={discoverySettings.genderPreference === item.value}
              label={item.label}
              onSetGenderPreference={() => onSetGenderPreference(item.value)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: rs(24),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: rs(20),
  },
});

export default GenderPreference;
