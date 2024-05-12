import { useCallback } from 'react';
import { useTranslation as Translation } from 'react-i18next';
import { TOptions } from 'i18next';

import { useApp } from '@app/hooks';

const useTranslation = () => {
  const { t: TFunction } = Translation();
  const { defaultLanguage } = useApp();

  const t = useCallback(
    (key: string, options?: TOptions) =>
      TFunction(key, {
        ...options,
        lng: defaultLanguage,
      }),
    [defaultLanguage],
  );

  return {
    t,
  };
};
export default useTranslation;
