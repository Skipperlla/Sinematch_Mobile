import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Input } from '@app/components';
import { rs } from '@app/utils';
import { useAccountSetup, useUser, useTranslation } from '@app/hooks';

import Layout from './Layout';

const Biography = () => {
  const { User, registerAction } = useUser();
  const { nextPage } = useAccountSetup();
  const { t } = useTranslation();
  const ref = useRef<InputRef>(null);
  const [biography, setBiography] = useState<string>(
    User?.info?.biography ||
      t('screens.signUp.biography.defaultState').toString(),
  );

  function onPress() {
    registerAction({
      info: {
        ...User?.info,
        biography,
      },
    }).then(() => {
      nextPage();
      setBiography((prev) => prev.trim());
    });
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
      title="screens.signUp.biography.title"
      description="screens.signUp.biography.description"
      onPress={onPress}
    >
      <Input
        ref={ref}
        placeholderText="screens.signUp.biography.placeholder"
        onChangeText={setBiography}
        value={biography}
        maxLength={200}
        multiline
        inputStyle={styles.input}
        autoFocus
        blurOnSubmit
        containerStyle={styles.containerStyle}
        numberOfLines={4}
        returnKeyType="next"
        onSubmitEditing={onPress}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingVertical: rs(6),
  },
  containerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    minHeight: 56,
  },
});

export default Biography;
