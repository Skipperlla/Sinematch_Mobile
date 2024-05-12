import React, { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Input } from '@app/components';
import { useUser, useAccountSetup } from '@app/hooks';

import Layout from './Layout';

const Email = () => {
  const { User, registerAction } = useUser();
  const { nextPage } = useAccountSetup();
  const [email, setEmail] = useState<string>(User?.email || '');
  const ref = useRef<InputRef>(null);

  function onPress() {
    registerAction({ email }).then(nextPage);
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
      title="screens.signUp.email.title"
      description="screens.signUp.email.description"
      onPress={onPress}
      isDisabled={!email}
    >
      <Input
        ref={ref}
        placeholderText="screens.signUp.email.placeholder"
        keyboardType="email-address"
        onChangeText={setEmail}
        maxLength={64}
        returnKeyType="next"
        autoComplete="email"
        autoCapitalize="none"
        value={email}
        autoFocus
        onSubmitEditing={onPress}
      />
    </Layout>
  );
};

export default Email;
