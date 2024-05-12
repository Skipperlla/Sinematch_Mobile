import {
  setTheme as setThemeReducer,
  setIsStartedAccountSetup as setIsStartedAccountSetupReducer,
  setDefaultLanguage as setDefaultLanguageReducer,
} from '@app/store/app.slice';
import { useAppDispatch, useAppSelector } from '@app/hooks';

export default function useApp() {
  const dispatch = useAppDispatch();

  const setTheme = (action: string) => dispatch(setThemeReducer(action));
  const setIsStartedAccountSetup = (payload: boolean) =>
    dispatch(setIsStartedAccountSetupReducer(payload));
  const setDefaultLanguage = (payload: string) =>
    dispatch(setDefaultLanguageReducer(payload));

  const app = useAppSelector((state) => state.app);

  return {
    ...app,
    setTheme,
    setIsStartedAccountSetup,
    setDefaultLanguage,
  };
}
