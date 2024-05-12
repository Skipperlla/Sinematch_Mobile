import { useAction } from '@app/hooks';
import { registerToken, sendNotification } from '@app/store/notification.slice';

export default function useNotification() {
  const registerTokenAction = useAction(registerToken);
  const sendNotificationAction = useAction(sendNotification);

  return {
    registerTokenAction,
    sendNotificationAction,
  };
}
