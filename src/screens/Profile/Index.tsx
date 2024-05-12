import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useRef } from 'react';

import { useAppNavigation, useUser } from '@app/hooks';
import { Pages } from '@app/constants';
import {
  FastImage,
  DiscountCard,
  TopBar,
  ProfileActionButton,
  BottomSheetContainer,
  LogoutBottomSheet,
} from '@app/components';
import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import type { ColorProps } from '@app/types/colors';

type ActionProps = {
  label: string;
  icon: string;
  labelColor?: keyof ColorProps;
  iconColor?: string;
  page?: Pages;
  func?: () => void;
};

const Index = () => {
  const { User } = useUser();
  const logoutRef = useRef<BottomSheetModalRef>(null);
  const navigation = useAppNavigation();

  const navigate = useCallback(() => navigation.navigate(Pages.My_Profile), []);

  const actions: ActionProps[] = [
    {
      label: 'screens.profile.settings',
      icon: 'curved_setting',
      page: Pages.Settings,
    },
    {
      label: 'screens.profile.helpCenter',
      icon: 'curved_info_square',
      page: Pages.Help_Center,
    },
    {
      label: 'screens.profile.logout',
      icon: 'curved_logout',
      iconColor: Colors.error,
      labelColor: 'error',
      func: () => logoutRef.current?.present(),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <TopBar />
      <TouchableOpacity onPress={navigate} activeOpacity={1}>
        <FastImage
          uri={String(User?.avatars?.[0]?.Location)}
          width={200}
          height={200}
          borderRadius={999}
          styles={styles.profileImage}
        />
      </TouchableOpacity>
      <DiscountCard />
      <View style={styles.actionsContainer}>
        {actions.map((action, index) => {
          return (
            <ProfileActionButton
              key={index}
              label={action.label}
              icon={action.icon}
              labelColor={action.labelColor}
              iconColor={action.iconColor}
              page={action.page}
              func={action.func}
            />
          );
        })}
      </View>
      <BottomSheetContainer
        containerStyle={styles.logoutBackgroundStyle}
        ref={logoutRef}
      >
        <LogoutBottomSheet />
      </BottomSheetContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: rs(24),
    flexGrow: 1,
  },
  profileImage: {
    marginBottom: rs(20),
  },
  actionsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: rs(24),
    gap: rs(24),
  },
  logoutBackgroundStyle: {
    borderRadius: 44,
  },
});

export default Index;
