import { View, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';

import { DiscoverySettingsButton, Text } from '@app/components';
import { rs } from '@app/utils';
import type { DiscoverySettingsProps } from '@app/types/redux/user';

const matchTypes = [
  {
    label: 'mediaTypes.movie',
    value: 1,
  },
  {
    label: 'mediaTypes.tv',
    value: 2,
  },
  {
    label: 'mediaTypes.all',
    value: 3,
  },
];

type Props = {
  setDiscoverySettings: React.Dispatch<
    React.SetStateAction<DiscoverySettingsProps>
  >;
  discoverySettings: DiscoverySettingsProps;
};

const MatchType = ({ setDiscoverySettings, discoverySettings }: Props) => {
  const onSetGenderPreference = useCallback(
    (value: number) =>
      setDiscoverySettings((prev) => {
        if (prev.matchType === value) return prev;
        return { ...prev, matchType: value };
      }),
    [],
  );

  return (
    <View style={styles.container}>
      <Text
        text="screens.discoverySettings.matchType"
        fontFamily="bold"
        size="h5"
        style={styles.title}
      />
      <View style={styles.buttonContainer}>
        {matchTypes.map((item, index) => {
          return (
            <DiscoverySettingsButton
              key={index}
              isEqual={discoverySettings.matchType === item.value}
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
    // marginVertical: rs(24),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: rs(20),
  },
});

export default MatchType;
