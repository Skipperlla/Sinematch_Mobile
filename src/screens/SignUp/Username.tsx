import React, { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Input } from '@app/components';
import { useUser, useAccountSetup } from '@app/hooks';

import Layout from './Layout';

const UserName = () => {
  const { User, registerAction } = useUser();
  const { nextPage } = useAccountSetup();
  const [userName, setUsername] = useState<string>(User?.userName || '');
  const ref = useRef<InputRef>(null);

  function onPress() {
    registerAction({ userName }).then(nextPage);
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
      title="screens.signUp.userName.title"
      subTitle="screens.signUp.userName.subTitle"
      description="screens.signUp.userName.description"
      onPress={onPress}
      isDisabled={!userName}
    >
      <Input
        ref={ref}
        placeholderText="screens.signUp.userName.placeholder"
        onChangeText={setUsername}
        value={userName}
        autoCapitalize="none"
        maxLength={30}
        returnKeyType="next"
        autoFocus
        onSubmitEditing={onPress}
      />
    </Layout>
  );
};

export default UserName;
