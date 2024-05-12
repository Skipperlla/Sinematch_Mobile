import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

import { rs } from '@app/utils';
import { Text } from '@app/components';
import { useApp } from '@app/hooks';

type Props = {
  setCurrentState: React.Dispatch<React.SetStateAction<string>>;
  currentState: string;
};

const MediaSelector = ({ setCurrentState, currentState }: Props) => {
  const { isDarkMode } = useApp();
  const buttons = [
    { label: 'screens.profileDetail.common', value: 'common' },
    { label: 'screens.profileDetail.profile', value: 'profile' },
  ];

  return (
    <View style={styles.container}>
      {buttons.map((button, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => setCurrentState(button.value)}
          >
            <Text
              text={button.label}
              size="h5"
              fontFamily="medium"
              color={
                currentState === button.value
                  ? 'primary500'
                  : isDarkMode
                  ? 'white'
                  : 'grey900'
              }
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: rs(24),
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: rs(24),
  },
});

export default MediaSelector;
