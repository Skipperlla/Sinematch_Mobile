import { useCallback } from 'react';
import ImagePicker, { Options } from 'react-native-image-crop-picker';

import { useGetPermission, useTranslation } from '@app/hooks';

export default function useImagePicker() {
  const { t } = useTranslation();
  const { openSettings } = useGetPermission();

  const onImagePicker = useCallback(async (props: Options) => {
    return await ImagePicker.openPicker({
      ...props,
      cropperChooseText: t('hooks.useImagePicker.choose').toString(),
      cropperCancelText: t('hooks.useImagePicker.cancel').toString(),
      loadingLabelText: t('hooks.useImagePicker.process').toString(),
      freeStyleCropEnabled: true,
      compressImageQuality: 1,
    })
      .then((result) => {
        const name = `${Math.floor(Math.random() * 1000000)}.${
          result.mime.split('/')[1]
        }`;
        return {
          uri: result?.path,
          name,
          type: result?.mime,
        };
      })
      .catch((err) => {
        if (err.code.includes('E_NO_LIBRARY_PERMISSION') as string)
          openSettings();
        throw err;
      });
  }, []);
  const onCamera = useCallback(async (props: Options) => {
    return await ImagePicker.openCamera({
      ...props,
      cropperChooseText: t('hooks.useImagePicker.choose').toString(),
      cropperCancelText: t('hooks.useImagePicker.cancel').toString(),
      loadingLabelText: t('hooks.useImagePicker.process').toString(),
      freeStyleCropEnabled: true,
    })
      .then((result) => {
        const name = `${Math.floor(Math.random() * 1000000)}.${
          result.mime.split('/')[1]
        }`;
        return {
          uri: result?.path,
          name,
          type: result?.mime,
        };
      })
      .catch((err) => {
        if (err.code.includes('E_NO_LIBRARY_PERMISSION') as string)
          openSettings();
        throw err;
      });
  }, []);

  return {
    onImagePicker,
    onCamera,
  };
}
