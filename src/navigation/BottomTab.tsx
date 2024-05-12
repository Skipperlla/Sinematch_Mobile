/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Home, Matches, Profile, Chats } from '@app/screens';
import { Pages } from '@app/constants';
import { Icon, Text } from '@app/components';
import { rs } from '@app/utils';
import { Colors } from '@app/styles';
import {
  useApp,
  useConversation,
  useDiscovery,
  useStyle,
  useUser,
} from '@app/hooks';
import type { RootStackParamList } from '@app/types/navigation';

const Tab = createBottomTabNavigator<RootStackParamList>();

const Index = () => {
  const { isDarkMode } = useApp();
  const { User } = useUser();
  const { Conversation } = useConversation();
  const { Likes } = useDiscovery();
  const unReadConversation = Conversation?.conversations?.filter(
    (item) =>
      item?.lastMessage &&
      !item?.lastMessage?.isRead &&
      User._id !== item?.lastMessage?.sender,
  ).length;

  const textStyle = useStyle(
    () => ({
      letterSpacing: 0.2,
    }),
    [],
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: !isDarkMode
            ? Colors.white
            : 'rgba(24, 26, 32, 0.85)',
          borderTopWidth: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
        tabBarLabelStyle: {
          textTransform: 'capitalize',
          letterSpacing: 0.2,
        },
        tabBarLabel({ focused }) {
          return (
            <Text
              text={`navigation.${route.name.toLowerCase()}`}
              fontFamily={focused ? 'bold' : 'medium'}
              size="bodyXSmall"
              style={textStyle}
              color={focused ? 'primary500' : 'grey500'}
            />
          );
        },

        tabBarIcon: ({ focused }) => {
          const color = focused ? Colors.primary500 : Colors.grey500;
          const size = rs(24);

          switch (route.name) {
            case Pages.Home:
              return (
                <Icon
                  icon={focused ? 'bold_discovery' : 'light_discovery'}
                  size={size}
                  color={color}
                />
              );
            case Pages.Matches:
              return (
                <Icon
                  icon={focused ? 'bold_heart' : 'light_heart'}
                  size={size}
                  color={color}
                />
              );
            case Pages.Profile:
              return (
                <Icon
                  icon={focused ? 'bold_profile' : 'light_profile'}
                  size={size}
                  color={color}
                />
              );
            case Pages.Chats:
              return (
                <Icon
                  icon={focused ? 'bold_chat' : 'light_chat'}
                  size={size}
                  color={color}
                />
              );
          }
        },
      })}
    >
      <Tab.Screen name={Pages.Home} component={Home} />
      <Tab.Screen
        name={Pages.Matches}
        component={Matches}
        options={{
          tabBarBadge: Likes?.discoveries?.length || undefined,
          tabBarBadgeStyle: {
            fontSize: rs(12),
          },
        }}
      />
      <Tab.Screen
        name={Pages.Chats}
        component={Chats}
        options={{
          tabBarBadge: unReadConversation || undefined,
          tabBarBadgeStyle: {
            fontSize: rs(12),
          },
        }}
      />
      <Tab.Screen name={Pages.Profile} component={Profile} />
    </Tab.Navigator>
  );
};

export default Index;
