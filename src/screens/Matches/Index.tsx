import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';

import { TopBar } from '@app/components';
import { useApp, useTranslation } from '@app/hooks';
import { Colors, Fonts } from '@app/styles';

import Likes from './Likes';
import Ignored from './Ignored';

type TabBarProps = SceneRendererProps & {
  navigationState: NavigationState<{
    key: string;
    title: string;
  }>;
};

const renderScene = SceneMap({
  first: Likes,
  second: Ignored,
});

const Index = () => {
  const { isDarkMode } = useApp();
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: t('screens.matches.likes') },
    { key: 'second', title: t('screens.matches.ignored') },
  ]);

  const renderTabBar = useCallback(
    (props: TabBarProps) => (
      <TabBar
        {...props}
        indicatorStyle={styles.indicatorStyle}
        labelStyle={styles.labelStyle}
        style={styles.renderTabBar}
        activeColor={Colors.primary500}
        inactiveColor={isDarkMode ? Colors.white : Colors.grey900}
      />
    ),
    [isDarkMode],
  );

  return (
    <View style={styles.container}>
      <TopBar />
      <TabView
        swipeEnabled={false}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelStyle: {
    fontFamily: Fonts.medium,
    letterSpacing: 0.2,
    fontStyle: 'normal',
    textTransform: 'capitalize',
  },
  renderTabBar: {
    backgroundColor: 'transparent',
  },
  indicatorStyle: { backgroundColor: Colors.primary500 },
});

export default Index;
