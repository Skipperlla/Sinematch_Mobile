import { View, StyleSheet } from 'react-native';
import React from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useRoute } from '@react-navigation/native';

import { FastImage } from '@app/components';
import { Colors, Fonts, Sizes } from '@app/styles';
import { rs } from '@app/utils';
import { useUser } from '@app/hooks';
import { Pages } from '@app/constants';
import type { RootRouteProps } from '@app/types/navigation';

const Users = () => {
  const { params } = useRoute<RootRouteProps<Pages.Matched>>();
  const { User } = useUser();
  const images = [params?.receiverAvatar, User?.avatars?.[0]?.Location];

  return (
    <View style={styles.container}>
      <View style={styles.circularProgressContainer}>
        <CircularProgress
          value={params.combinedMatchRatio}
          radius={25}
          progressValueColor={Colors.grey900}
          valueSuffix={'%'}
          activeStrokeWidth={4}
          activeStrokeColor={Colors.primary500}
          inActiveStrokeColor={Colors.primary100}
          inActiveStrokeWidth={4}
          progressValueFontSize={Sizes.bodySmall}
          progressValueStyle={{ fontFamily: Fonts.semiBold }}
          maxValue={100}
        />
      </View>
      {images?.map((image, index) => {
        return (
          <View
            key={index}
            style={[
              styles.card,
              {
                borderBottomLeftRadius: index ? 0 : 80,
                borderBottomRightRadius: !index ? 0 : 80,
                marginRight: index ? 0 : rs(24),
              },
            ]}
          >
            <FastImage
              uri={String(image)}
              width={148}
              height={176}
              styles={[
                styles.image,
                {
                  borderBottomLeftRadius: index ? 0 : 80,
                  borderBottomRightRadius: !index ? 0 : 80,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  circularProgressContainer: {
    width: rs(56),
    height: rs(56),
    position: 'absolute',
    backgroundColor: Colors.white,
    zIndex: 1,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary500,
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 16,
  },
  card: {
    width: rs(148),
    height: rs(176),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    overflow: 'hidden',
  },
  image: {
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
});

export default Users;
