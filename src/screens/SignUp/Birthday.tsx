import React, { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Masks } from 'react-native-mask-input';

import { MaskedInput } from '@app/components';
import { useUser, useAccountSetup, useApp } from '@app/hooks';
import { birthdayFormatter } from '@app/utils';

import Layout from './Layout';

const Birthday = () => {
  const { User, registerAction } = useUser();
  const { defaultLanguage } = useApp();
  const { nextPage } = useAccountSetup();
  const [birthday, setBirthday] = useState<string>(
    User?.info?.birthday
      ? dayjs(User?.info?.birthday).format(
          defaultLanguage === 'tr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
        )
      : '',
  );
  const ref = useRef<InputRef>(null);

  function onPress() {
    registerAction({
      info: {
        ...User?.info,
        birthday: birthdayFormatter(birthday, defaultLanguage),
      },
    }).then(nextPage);
  }

  useFocusEffect(
    useCallback(() => {
      const focus = setTimeout(() => {
        if (ref.current) ref.current.focus();
      }, 100);
      return () => clearTimeout(focus);
    }, []),
  );

  return (
    <Layout
      title="screens.signUp.birthday.title"
      onPress={onPress}
      isDisabled={!birthday}
    >
      <MaskedInput
        ref={ref}
        value={String(birthday)}
        returnKeyType="next"
        autoFocus
        placeholderText="screens.signUp.birthday.placeholder"
        onChangeText={setBirthday}
        keyboardType="number-pad"
        mask={
          defaultLanguage === 'tr' ? Masks.DATE_DDMMYYYY : Masks.DATE_MMDDYYYY
        }
        onSubmitEditing={onPress}
      />
    </Layout>
  );
};

export default Birthday;
