import React, { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Input } from '@app/components';
import { useUser, useAccountSetup } from '@app/hooks';

import Layout from './Layout';

const FullName = () => {
  const { User, registerAction } = useUser();
  const { nextPage } = useAccountSetup();
  const [fullName, setFullName] = useState<string>(User?.fullName || '');
  const ref = useRef<InputRef>(null);

  function onPress() {
    registerAction({ fullName }).then(nextPage);
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
      title="screens.signUp.fullName.title"
      subTitle="screens.signUp.fullName.subTitle"
      description="screens.signUp.fullName.description"
      onPress={onPress}
      isDisabled={!fullName}
    >
      <Input
        ref={ref}
        placeholderText="screens.signUp.fullName.placeholder"
        onChangeText={setFullName}
        value={fullName}
        autoFocus
        maxLength={30}
        returnKeyType="next"
        onSubmitEditing={onPress}
      />
    </Layout>
  );
};

export default FullName;
