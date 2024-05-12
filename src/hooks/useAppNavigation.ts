import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from 'types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function useAppNavigation() {
  return navigationRef;
}
