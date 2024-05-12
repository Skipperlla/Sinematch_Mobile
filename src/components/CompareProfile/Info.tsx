import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useQuery } from '@tanstack/react-query';
import { UserService } from '@app/api';
import { useRoute } from '@react-navigation/native';

import { useApp, useAppNavigation, useUser } from '@app/hooks';
import { Colors, Fonts, Sizes } from '@app/styles';
import { lib, rs } from '@app/utils';
import { Icon, Text } from '@app/components';
import { UserProps } from '@app/types/redux/user';
import { Pages } from '@app/constants';
import type { RootRouteProps } from '@app/types/navigation';

type Props = {
  data: UserProps;
};

const _Info = ({ data }: Props) => {
  const { isDarkMode } = useApp();
  const { User } = useUser();
  const { params } = useRoute<RootRouteProps<Pages.Profile_Detail>>();
  const navigation = useAppNavigation();

  const { data: compareProfileData } = useQuery(
    [params?.userId],
    () => UserService.compareProfile(params?.userId),
    {
      enabled: false,
    },
  );

  const navigate = useCallback(() => {
    navigation.navigate(Pages.Edit_Profile);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? Colors.dark1 : Colors.white,
        },
      ]}
    >
      <View style={styles.nameTopContainer}>
        <View style={styles.nameSubContainer}>
          <Text
            text={`${data?.fullName}, ${lib.ageCalc(data?.info?.birthday)}`}
            fontFamily="bold"
            size="h3"
            style={styles.textMarginTop}
          />
          {User?.uuid === data?.uuid ? (
            <TouchableOpacity onPress={navigate}>
              <Icon
                icon="curved_edit"
                size={rs(30)}
                color={Colors.primary500}
              />
            </TouchableOpacity>
          ) : (
            <CircularProgress
              value={Number(compareProfileData?.matchPercent)}
              radius={25}
              progressValueColor={isDarkMode ? Colors.white : Colors.grey900}
              valueSuffix={'%'}
              activeStrokeWidth={4}
              activeStrokeColor={Colors.primary500}
              inActiveStrokeColor={Colors.primary100}
              inActiveStrokeWidth={4}
              progressValueFontSize={Sizes.bodySmall}
              progressValueStyle={{ fontFamily: Fonts.semiBold }}
              maxValue={100}
            />
          )}
        </View>

        {data?.info?.biography && (
          <>
            <Text
              text="screens.profileDetail.about"
              fontFamily="bold"
              size="h5"
            />
            <Text
              text={data?.info?.biography}
              fontFamily="medium"
              size="bodyLarge"
              style={styles.textMarginTop}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    height: '100%',
    top: -44,
    paddingTop: rs(24),
    paddingHorizontal: rs(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameTopContainer: {
    flex: 1,
  },
  nameSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textMarginTop: {
    marginVertical: rs(12),
    flex: 1,
  },
});

export default memo(_Info);
