import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as RNLocalize from 'react-native-localize';
// import { languageCode } from '@app/lang/_i18n';

export const languageCode = RNLocalize.getLocales()[0].languageCode;

type AppState = {
  isDarkMode: boolean;
  isStartedAccountSetup: boolean;
  defaultLanguage: string;
};
const initialState: AppState = {
  isDarkMode: false,
  isStartedAccountSetup: false,
  defaultLanguage: languageCode,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.isDarkMode = action.payload === 'dark';
    },
    setIsStartedAccountSetup: (state, action: PayloadAction<boolean>) => {
      state.isStartedAccountSetup = action.payload;
    },
    setDefaultLanguage: (state, action: PayloadAction<string>) => {
      state.defaultLanguage = action.payload;
    },
  },
});

export default appSlice.reducer;
export const { setTheme, setIsStartedAccountSetup, setDefaultLanguage } =
  appSlice.actions;
