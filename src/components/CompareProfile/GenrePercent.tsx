import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback } from 'react';

import { rs } from '@app/utils';
import { Icon, Text } from '@app/components';
import { Colors } from '@app/styles';
import { CommonGenreProps } from '@app/types/redux/user';
import { useRoute } from '@react-navigation/native';
import { Pages } from '@app/constants';
import { useAppNavigation } from '@app/hooks';

type Props = {
  title: string;
  data: CommonGenreProps[];
};

const _GenrePercent = ({ title, data }: Props) => {
  const routeName = useRoute().name;
  const navigation = useAppNavigation();
  const navigate = useCallback(() => {
    navigation.navigate(Pages.Single_Edit_Profile, {
      editType: 'Genre',
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text text={title} fontFamily="bold" size="h5" style={styles.title} />
        {Pages.My_Profile === routeName && (
          <TouchableOpacity onPress={navigate}>
            <Icon icon="curved_edit" size={rs(24)} color={Colors.primary500} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.percentageTopContainer}>
        {data?.map((item, index) => {
          return (
            <View style={styles.percentageSubContainer} key={index}>
              <View
                style={[
                  styles.percentage,
                  {
                    width: `${item.percentage}%`,
                  },
                ]}
              />
              <Text
                text={item.name}
                fontFamily="medium"
                size="bodyMedium"
                style={styles.percentageText}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rs(24),
    paddingVertical: rs(12),
  },
  title: { flex: 1 },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rs(12),
  },
  percentageTopContainer: {
    flexDirection: 'column',
    gap: rs(12),
  },
  percentageSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: rs(30),
    borderRadius: 24,
  },
  percentage: {
    height: rs(30),
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: Colors.primary500,
  },
  percentageText: {
    marginLeft: rs(8),
  },
});

export default memo(_GenrePercent);
