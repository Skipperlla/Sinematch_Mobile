import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import App from './src/Bootstrap';
import { name as appName } from './app.json';

// // Register background handler
// messaging().setBackgroundMessageHandler(
//   async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
//     console.log('Message handled in the background!', remoteMessage);
//   },
// );

AppRegistry.registerComponent(appName, () => App);
