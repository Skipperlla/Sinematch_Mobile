import { View, StyleSheet } from 'react-native';
import React, { memo, useCallback } from 'react';

import { RangeSlider, Text } from '@app/components';
import { lib, rs } from '@app/utils';
import { useUser } from '@app/hooks';
import type { DiscoverySettingsProps } from '@app/types/redux/user';
import type { SliderProps } from '@app/components/RangeSlider/Index';

type Props = {
  setDiscoverySettings: React.Dispatch<
    React.SetStateAction<DiscoverySettingsProps>
  >;
};

const GenderPreference = ({ setDiscoverySettings }: Props) => {
  const { User } = useUser();
  const min = lib.ageCalc(User?.discoverySettings?.ageRange?.min);
  const max = lib.ageCalc(User?.discoverySettings?.ageRange?.max);

  const onSetGenderPreference = useCallback(
    (value: SliderProps) =>
      setDiscoverySettings((prev) => {
        if (
          prev.ageRange?.max === value.max &&
          prev.ageRange?.min === value.min
        )
          return prev;

        return { ...prev, ageRange: value };
      }),
    [],
  );

  return (
    <View style={styles.container}>
      <Text
        text="screens.discoverySettings.ageRange"
        fontFamily="bold"
        size="h5"
        style={styles.title}
      />
      <View style={styles.buttonContainer}>
        <RangeSlider
          onValueChange={onSetGenderPreference}
          min={18}
          max={100}
          minDefaultValue={max}
          maxDefaultValue={min}
        />
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
    justifyContent: 'center',
  },
  title: {
    marginBottom: rs(44),
  },
});

export default memo(GenderPreference);
