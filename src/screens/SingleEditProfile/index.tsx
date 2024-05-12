import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pages } from '@app/constants';
import { Icon, SingleEditProfile } from '@app/components';
import { rs } from '@app/utils';
import { useApp, useAppNavigation } from '@app/hooks';
import { Colors } from '@app/styles';
import type { RootRouteProps } from '@app/types/navigation';

const Index = () => {
  const { params } = useRoute<RootRouteProps<Pages.Single_Edit_Profile>>();
  const { isDarkMode } = useApp();
  const navigation = useAppNavigation();
  const RenderEditType = useMemo(() => {
    switch (params?.editType as string) {
      case 'Gender':
        return <SingleEditProfile.Gender />;
      case 'Genre':
        return <SingleEditProfile.Genre />;
      case 'Avatars':
        return <SingleEditProfile.Avatars />;
      default:
        return <SingleEditProfile.Favorite />;
    }
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: StatusBar.currentHeight,
        },
      ]}
    >
      <View style={styles.backButton}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Icon
            icon="light_outline_arrow_left"
            size={rs(32)}
            color={isDarkMode ? Colors.white : Colors.grey900}
          />
        </TouchableOpacity>
      </View>

      {RenderEditType}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: rs(24),
    gap: rs(12),
    marginBottom: rs(12),
  },
});

export default Index;
