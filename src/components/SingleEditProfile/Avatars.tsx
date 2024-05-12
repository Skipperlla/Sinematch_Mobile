import React, { memo, useCallback, useState } from 'react';
import { View } from 'react-native';
import DraggableGrid from 'react-native-draggable-grid';

import { useUser } from '@app/hooks';
import { DraggableImageCard } from '@app/components';
import type { ImageProps } from '@app/types/redux/user';

const _Avatars = () => {
  const { Images, isLoading, changeAvatarSequenceAction, setPicture } =
    useUser();
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

  return (
    <DraggableGrid
      numColumns={3}
      renderItem={renderItem}
      itemHeight={140}
      data={Images}
      onDragStart={onDragStart}
      onDragRelease={onDragRelease}
    />
  );
};

export default memo(_Avatars);
