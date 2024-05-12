import { useCallback } from 'react';
import RNHapticFeedback from 'react-native-haptic-feedback';

const useHapticFeedback = () => {
  const triggerHapticFeedback = useCallback((type = 'notificationSuccess') => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };

    RNHapticFeedback.trigger(type, options);
  }, []);

  return triggerHapticFeedback;
};

export default useHapticFeedback;
