import * as RNLocalize from 'react-native-localize';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en, tr } from '@app/lang/translations/index';
import { Languages } from '@app/constants/index';

export const languageCode = RNLocalize.getLocales()[0].languageCode;
const languages = [...Object.values(Languages)];

const locale = languages.includes(languageCode) ? languageCode : Languages.tr;

const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
};

i18n.use(initReactI18next).init({
  resources,
  //* language to use if translations in user language are not available
  lng: locale,
  fallbackLng: languages.includes(locale) ? locale : Languages.tr,
  preload: languages,
  supportedLngs: languages,
  lowerCaseLng: true,
  nsSeparator: false,
  cleanCode: true,
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export default i18n;
