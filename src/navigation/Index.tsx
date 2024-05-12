import React, { useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import analytics from '@react-native-firebase/analytics';

import {
  LetsYouIn,
  FullName,
  Username,
  Email,
  Biography,
  Birthday,
  Gender,
  GenderPreference,
  Genre,
  Favorite,
  Media,
  Avatar,
  Matched,
  Subscribe,
  Profile_Detail,
  Swipe_Back,
  Settings,
  Help_Center,
  Personal_Information,
  Notifications,
  Language,
  DiscoverySettings,
  Blocked_Users,
  Edit_Profile,
  My_Profile,
  Single_Edit_Profile,
  New_Chat_Detail,
  Chat_Image,
  Privacy_Policy,
  Terms_Of_Service,
} from '@app/screens';
import { Pages } from '@app/constants';
import { useApp, useUser } from '@app/hooks';
import { Colors } from '@app/styles';
import { navigationRef } from '@app/hooks/useAppNavigation';
import type { RootStackParamList } from 'types/navigation';

import BottomTab from './BottomTab';

const NativeStack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const { isStartedAccountSetup, isDarkMode } = useApp();
  const { isLoggedIn } = useUser();
  const routeNameRef = useRef<string>();

  const initialRouteName =
    isLoggedIn && !isStartedAccountSetup
      ? Pages.Bottom_Tab
      : isStartedAccountSetup
      ? Pages.FullName
      : Pages.LetsYouIn;

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: isDarkMode ? Colors.dark1 : Colors.white,
    },
  };

  const config = {
    screens: {
      Chat_Details: {
        path: 'chatDetail/:conversationId/:discoveryId/:receiverFullName/:receiverId',
        parse: {
          receiverFullName: (receiverFullName: string) => {
            return decodeURIComponent(receiverFullName);
          },
        },
      },
      Bottom_Tab: {
        screens: {
          Matches: 'likes',
        },
      },
    },
  };
  const linking = {
    initialRouteName: 'Bottom_Tab',
    prefixes: ['https://myapp.com', 'myapp://'],
    config,
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={MyTheme}
      linking={linking}
      onReady={() => {
        routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName =
          navigationRef?.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <NativeStack.Navigator initialRouteName={initialRouteName}>
        <NativeStack.Group screenOptions={{ headerShown: false }}>
          {isLoggedIn && !isStartedAccountSetup ? (
            <>
              <NativeStack.Screen
                name={Pages.Bottom_Tab}
                component={BottomTab}
              />
              <NativeStack.Screen name={Pages.Matched} component={Matched} />
              <NativeStack.Screen
                name={Pages.Subscribe}
                component={Subscribe}
              />
              {/* <NativeStack.Screen
                name={Pages.Chat_Details}
                component={ChatDetails}
              /> */}
              <NativeStack.Screen
                name={Pages.Profile_Detail}
                component={Profile_Detail}
              />
              <NativeStack.Screen
                name={Pages.Swipe_Back}
                component={Swipe_Back}
              />
              <NativeStack.Screen name={Pages.Settings} component={Settings} />
              <NativeStack.Screen
                name={Pages.Help_Center}
                component={Help_Center}
              />
              <NativeStack.Screen
                name={Pages.Personal_Information}
                component={Personal_Information}
              />
              <NativeStack.Screen
                name={Pages.Discovery_Settings}
                component={DiscoverySettings}
              />
              <NativeStack.Screen
                name={Pages.Notifications}
                component={Notifications}
              />
              <NativeStack.Screen
                name={Pages.Blocked_Users}
                component={Blocked_Users}
              />
              <NativeStack.Screen name={Pages.Language} component={Language} />
              <NativeStack.Screen
                name={Pages.Edit_Profile}
                component={Edit_Profile}
              />
              <NativeStack.Screen
                name={Pages.My_Profile}
                component={My_Profile}
              />
              <NativeStack.Screen
                name={Pages.Single_Edit_Profile}
                component={Single_Edit_Profile}
              />
              <NativeStack.Screen
                name={Pages.Chat_Details}
                component={New_Chat_Detail}
              />
              <NativeStack.Screen
                name={Pages.Chat_Image}
                component={Chat_Image}
              />
              <NativeStack.Screen
                name={Pages.Privacy_Policy}
                component={Privacy_Policy}
              />
              <NativeStack.Screen
                name={Pages.Terms_Of_Service}
                component={Terms_Of_Service}
              />
            </>
          ) : (
            <NativeStack.Group
              screenOptions={{
                gestureEnabled: false,
              }}
            >
              <NativeStack.Screen
                name={Pages.LetsYouIn}
                component={LetsYouIn}
              />
              <NativeStack.Screen name={Pages.FullName} component={FullName} />
              <NativeStack.Screen name={Pages.Username} component={Username} />
              <NativeStack.Screen name={Pages.Email} component={Email} />
              <NativeStack.Screen name={Pages.Birthday} component={Birthday} />
              <NativeStack.Screen
                name={Pages.Biography}
                component={Biography}
              />
              <NativeStack.Screen name={Pages.Gender} component={Gender} />
              <NativeStack.Screen
                name={Pages.Gender_Preference}
                component={GenderPreference}
              />
              <NativeStack.Screen name={Pages.Genre} component={Genre} />
              <NativeStack.Screen name={Pages.Favorite} component={Favorite} />
              <NativeStack.Screen name={Pages.Avatar} component={Avatar} />
            </NativeStack.Group>
          )}
          <NativeStack.Screen name={Pages.Media} component={Media} />
        </NativeStack.Group>
      </NativeStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
