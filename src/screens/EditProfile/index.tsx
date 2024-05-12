import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
  Platform,
} from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResizeMode } from 'react-native-keyboard-controller';
import dayjs from 'dayjs';

import { rs } from '@app/utils';
import { Icon, Text } from '@app/components';
import { useApp, useAppNavigation, useUser, useTranslation } from '@app/hooks';
import { Colors } from '@app/styles';

import KeyboardAwareScrollView from './KeyboardAwareScrollView';
import Field from './Field';

type PersonalInformationType = {
  value?: string;
  label: string;
  placeholderText?: string;
  isInfo?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
  // TODO: Fix any type
  page?: any;
};

const Index = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const { isDarkMode, defaultLanguage } = useApp();
  const { User } = useUser();
  const navigation = useAppNavigation();
  const personalInformation: PersonalInformationType[] = [
    {
      value: User.fullName,
      label: 'fullName',
      placeholderText: 'screens.signUp.fullName.placeholder',
    },
    {
      value: User.userName,
      label: 'userName',
      placeholderText: 'screens.signUp.userName.placeholder',
    },
    {
      value: User.email,
      label: 'email',
      keyboardType: 'email-address',
      placeholderText: 'screens.signUp.email.placeholder',
    },
    {
      value: User.info?.biography,
      label: 'biography',
      isInfo: true,
      placeholderText: 'screens.signUp.biography.placeholder',
    },
    {
      value: dayjs(User?.info?.birthday).format(
        defaultLanguage === 'tr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
      ),
      label: 'birthday',
      isInfo: true,
      placeholderText: 'screens.signUp.birthday.placeholder',
    },
    {
      value: String(t(`components.button.editProfile.${User.info?.gender}`)),
      label: 'gender',
    },
  ];
  useResizeMode();

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingTop: Platform.OS === 'ios' ? top : top + 15,
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Icon
            icon="light_outline_arrow_left"
            size={rs(32)}
            color={isDarkMode ? Colors.white : Colors.grey900}
          />
        </TouchableOpacity>
        <Text fontFamily="bold" size="h4" text="screens.editProfile.title" />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingBottom: bottom,
          },
        ]}
        style={styles.awareScrollView}
      >
        {personalInformation.map((item, index) => {
          return (
            <Field
              key={index}
              value={String(item.value)}
              label={item.label}
              isInfo={item.isInfo}
              placeholderText={item.placeholderText}
              keyboardType={item?.keyboardType}
            />
          );
        })}
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    paddingHorizontal: rs(24),
    gap: rs(28),
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(12),
    paddingHorizontal: rs(24),
  },
  contentContainer: {
    flexGrow: 1,
    gap: rs(28),
    paddingHorizontal: rs(24),
  },
  awareScrollView: {
    marginTop: rs(24),
  },
});

export default Index;
