import {
  View,
  Text as RNText,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { memo } from 'react';

import { rs } from '@app/utils';
import { Icon, Text } from '@app/components';

type Props = {
  fullName: string;
  age: string;
  biography?: string;
  isActive?: boolean;
  navigate: () => void;
  currentRoute: boolean;
};

const Info = ({
  fullName,
  age,
  biography,
  isActive,
  navigate,
  currentRoute,
}: Props) => {
  return (
    <View
      style={[
        styles.container,
        {
          bottom: currentRoute ? rs(6) : rs(35),
        },
      ]}
      pointerEvents={currentRoute ? 'none' : 'box-none'}
    >
      <TouchableOpacity
        onPress={currentRoute ? undefined : !isActive ? navigate : undefined}
        activeOpacity={1}
      >
        <View style={styles.infoContainer}>
          <RNText style={styles.textContainer}>
            <Text
              fontFamily="bold"
              size={currentRoute ? 'h5' : 'h3'}
              text={fullName}
              color="white"
            />
            <Text
              fontFamily="bold"
              size={currentRoute ? 'h5' : 'h3'}
              text={', ' + age}
              color="white"
            />
          </RNText>
          {!currentRoute && (
            <TouchableOpacity onPress={navigate}>
              <Icon icon="bold_arrow_up_circle" size={rs(32)} color="white" />
            </TouchableOpacity>
          )}
        </View>
        {!currentRoute && biography && (
          <View style={styles.biographyContainer}>
            <Text
              fontFamily="semiBold"
              size="bodyXLarge"
              numberOfLines={2}
              text={biography}
              color="white"
              style={styles.biography}
            />
          </View>
        )}
      </TouchableOpacity>
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
