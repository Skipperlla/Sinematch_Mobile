import { memo, useEffect } from 'react';
import { Linking } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import { useAppNavigation, useNotification, useUser } from '@app/hooks';
import { Colors } from '@app/styles';

const CHANNEL_ID = 'sinematch_mobile_android_notification_channel';
const CHANNEL_NAME = 'default_notification_channel_id';

const CloudMessaging: React.FC<{ onMessageReceived?: () => void }> = ({
  onMessageReceived,
}) => {
  const { isLoggedIn } = useUser();
  const { registerTokenAction } = useNotification();
  const navigation = useAppNavigation();

  const getFCMToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    console.log('Device registered for remote messages');

    await messaging().getAPNSToken();
    console.log('APNS token received');

    const messagingToken = await messaging().getToken();
    console.log('Messaging token: ', messagingToken);
    if (messagingToken && isLoggedIn) {
      registerTokenAction(messagingToken);
    } else {
      console.error('No token received');
    }
  };
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      await getFCMToken();
      console.log('Authorization status:', authStatus);
    }
  };

  function handleNotificationActions(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) {
    const openURL = remoteMessage?.data?.openURL;
    const hasOpenURL = !!openURL;

    if (hasOpenURL) {
      console.log(remoteMessage.data);

      Linking.openURL(openURL as string);
    }
  }

  const notificationListener = () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      handleNotificationActions(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          handleNotificationActions(remoteMessage);
        }
      });
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    requestUserPermission();
    notificationListener();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', remoteMessage);
      if (remoteMessage.notification) {
        onMessageReceived && onMessageReceived();
        PushNotification.createChannel(
          {
            channelId: CHANNEL_ID,
            channelName: CHANNEL_NAME,
            soundName: 'default',
            importance: 4,
            vibrate: true,
          },
          (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
        );
        PushNotification.configure({
          onNotification: (notification) => {
            console.log('onNotification:', notification);
            handleNotificationActions(remoteMessage);
            notification.finish(PushNotificationIOS.FetchResult.NoData);
          },
        });
        const currentRouteName = navigation.getCurrentRoute()?.name;
        console.log('currentRouteName', currentRouteName);
        console.log('(remoteMessage.data', remoteMessage.data);

        if (remoteMessage.data?.page !== currentRouteName) {
          PushNotification.localNotification({
            color: Colors.primary500,
            channelId: CHANNEL_ID,
            title: remoteMessage.notification.title,
            message: remoteMessage.notification.body as string,
            smallIcon: 'ic_notification',
            largeIcon: 'ic_notification',
          });
        }
      }
    });
    return unsubscribe;
  }, [isLoggedIn]);
  useEffect(() => {
    PushNotification.configure({
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);

  return null;
};

export default memo(CloudMessaging);
