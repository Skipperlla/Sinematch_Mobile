import React, { useCallback, useState } from 'react';
import { Platform, View } from 'react-native';
import DraggableGrid from 'react-native-draggable-grid';
import crashlytics from '@react-native-firebase/crashlytics';

import { useApp, useUser } from '@app/hooks';
import { ImageProps } from '@app/types/redux/user';
import { DraggableImageCard } from '@app/components';

import Layout from './Layout';

const Chrome = () => {
  const {
    Images,
    isLoading,
    changeAvatarSequenceAction,
    setPicture,
    isLoggedInAction,
    User,
    updateProfileAction,
  } = useUser();
  const { setIsStartedAccountSetup, defaultLanguage } = useApp();
  const [currentItem, setCurrentItem] = useState<ImageProps>({} as ImageProps);

  const onDragStart = useCallback(
    (data: ImageProps) => setCurrentItem(data),
    [],
  );
  const renderItem = useCallback((item: ImageProps, index: number) => {
    if (item?.Location)
      return (
        <View key={item.key}>
          <DraggableImageCard
            image={item?.Location}
            Bucket={item?.Bucket}
            index={index}
            imageKey={item.key}
          />
        </View>
      );
    return (
      <DraggableImageCard
        key={item.key}
        image={item?.Location}
        Bucket={item?.Bucket}
        index={index}
        imageKey={item.key}
      />
    );
  }, []);
  const onDragRelease = useCallback(
    (drag: ImageProps[]) => {
      const totalValidLength = Images?.filter((picture) => {
        return picture?.Location;
      });
      const index = drag?.findIndex((item) => {
        return item?.index === currentItem?.index;
      });

      if (index + 1 === currentItem.index) setPicture(drag);
      else if (
        currentItem?.Location &&
        index + 1 <= totalValidLength?.length &&
        !isLoading
      ) {
        changeAvatarSequenceAction(drag);
        setPicture(drag);
      }
    },
    [Images, currentItem, isLoading],
  );

  const onNextPage = useCallback(
    () =>
      updateProfileAction({
        isCompletedProfile: true,
        platform: Platform.OS,
        appLanguage: defaultLanguage,
      }).then(() =>
        isLoggedInAction().then(() => {
          setIsStartedAccountSetup(false);
          crashlytics().setUserId(String(User?.uuid));
        }),
      ),
    [],
  );

  return (
    <Layout
      title="screens.signUp.avatar.title"
      description="screens.signUp.avatar.description"
      onPress={onNextPage}
      isDisabled={!User?.avatars?.length}
    >
      <DraggableGrid
        numColumns={3}
        renderItem={renderItem}
        itemHeight={140}
        data={Images}
        onDragStart={onDragStart}
        onDragRelease={onDragRelease}
      />
    </Layout>
  );
};

export default Chrome;
