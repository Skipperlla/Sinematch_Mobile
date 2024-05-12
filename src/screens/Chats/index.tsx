import { StyleSheet, View } from 'react-native';
import React from 'react';

import { TopBar } from '@app/components';

import NewMatches from './NewMatches';
import Messages from './Messages';

const Index = () => {
  return (
    <View style={styles.container}>
      <TopBar />
      <NewMatches />
      <Messages />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Index;
