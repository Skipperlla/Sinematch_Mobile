import { View, Text as RNText, StyleSheet } from 'react-native';
import React, { memo } from 'react';

import { rs } from '@app/utils';
import { Text } from '@app/components';

type Props = {
  fullName: string;
  age: string;
};

const Info = ({ fullName, age }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <RNText style={styles.textContainer}>
          <Text fontFamily="bold" size="h5" text={fullName} color="white" />
          <Text fontFamily="bold" size="h5" text={', ' + age} color="white" />
        </RNText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 30,
    paddingHorizontal: rs(14),
    flexDirection: 'column',
    flex: 1,
    bottom: rs(6),
  },
  biography: {
    letterSpacing: 0.2,
    flex: 1,
    marginRight: rs(8),
  },
  biographyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    marginBottom: rs(8),
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs(8),
  },
});

export default memo(Info);
