import { ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import Markdown from 'react-native-markdown-display';

import { useApp } from '@app/hooks';
import { legalDocuments } from '@app/constants';
import { SettingsContainer } from '@app/components';
import { rs } from '@app/utils';

const TermsOfService = () => {
  const { defaultLanguage } = useApp();

  return (
    <SettingsContainer title="screens.helpCenter.termsOfService">
      <ScrollView
        scrollEventThrottle={16}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <Markdown>{legalDocuments.termsOfService[defaultLanguage]}</Markdown>
      </ScrollView>
    </SettingsContainer>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: rs(30),
  },
});

export default TermsOfService;
