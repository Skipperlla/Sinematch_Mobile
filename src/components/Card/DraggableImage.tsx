import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, { memo, useCallback } from 'react';
import { useNotify } from 'rn-notify';

import { Colors } from '@app/styles';
import { FastImage, Icon } from '@app/components';
import * as Icons from '@app/components/icons';
import { rs } from '@app/utils';
import { useUser, useImagePicker } from '@app/hooks';

type Props = {
  image: string;
  imageKey: string;
  Bucket: string;
  index?: number;
};

const _DraggableImageCard = ({ image, index, imageKey, Bucket }: Props) => {
  const { onImagePicker } = useImagePicker();
  const notify = useNotify();
  const {
    isLoading,
    changePrimaryAvatarAction,
    uploadProfilePhotoAction,
    deleteAvatarAction,
  } = useUser();

  const addAvatar = useCallback(
    () =>
      onImagePicker({
        width: 1200,
        height: 1200,
        cropping: true,
        mediaType: 'photo',
      }).then((data) => {
        if (!index && image) changePrimaryAvatarAction(data);
        else
          uploadProfilePhotoAction(data).then((result) => {
            notify.success({
              message: result?.message,
              duration: 5000,
            });
          });
      }),
    [image, index],
  );
  const deleteAvatar = useCallback(
    () => deleteAvatarAction({ key: imageKey, Bucket }),
    [imageKey],
  );

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={addAvatar} disabled={isLoading}>
        {image ? (
          <>
            {Number(index) > 0 && (
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={deleteAvatar}
                disabled={isLoading}
              >
                <Icon icon="close_outline" size={14} color={Colors.white} />
              </TouchableOpacity>
            )}
            <FastImage
              uri={image}
              priority="high"
              width={100}
              height={100}
              borderRadius={16}
            />
          </>
        ) : (
          <View style={styles.addImageContainer}>
            <LinearGradient
              style={styles.linearGradient}
              colors={Colors.gradientPurple}
            >
              <Icons.Plus />
            </LinearGradient>
          </View>
        )}
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: rs(100),
    height: rs(100),
    borderRadius: 16,
    backgroundColor: Colors.transparentPurple,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: rs(16),
    height: rs(16),
    borderRadius: 999,
    backgroundColor: Colors.transparentBlack,
    justifyContent: 'center',
    zIndex: 1,
    alignItems: 'center',
  },
  addImageContainer: {
    borderStyle: 'dashed',
    borderWidth: 2,
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.primary500,
    zIndex: 1,
  },
  linearGradient: {
    width: rs(32),
    height: rs(32),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(_DraggableImageCard);
