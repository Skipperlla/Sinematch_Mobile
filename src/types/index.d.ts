import { TextInput } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import store from '@app/store';

declare global {
  type InputRef = TextInput | null;
  type RootState = ReturnType<typeof store.getState>;
  type AppDispatch = typeof store.dispatch;
  type BottomSheetModalRef = BottomSheetModal;
}
