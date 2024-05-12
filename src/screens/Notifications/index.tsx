import { View, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';

import { rs } from '@app/utils';
import { Button, NotificationButton, SettingsContainer } from '@app/components';
import { useUser } from '@app/hooks';
import type { NotificationProps } from '@app/types/redux/user';

const Index = () => {
  const { User, updateNotificationAction, isLoading } = useUser();
  const [notifications, setNotifications] = useState<NotificationProps>(
    User?.notifications || ({} as NotificationProps),
  );
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const onChangeNotification = useCallback((key: string, value: boolean) => {
    setIsChanged(true);
    setNotifications((prev) => {
      return { ...prev, [key]: value };
    });
  }, []);

  return (
    <SettingsContainer title="screens.notifications.title">
      <View style={styles.container}>
        {Object.entries(notifications).map((item, index) => {
          return (
            <NotificationButton
              key={index}
              label={item[0]}
              value={item[1]}
              onSwitchChange={() => onChangeNotification(item[0], !item[1])}
            />
          );
        })}
      </View>
      <Button
        isLoading={isLoading}
        disabled={!isChanged}
        shadow
        text="screens.notifications.save"
        onPress={() =>
          updateNotificationAction(notifications).then(() =>
            setIsChanged(false),
          )
        }
      />
    </SettingsContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: rs(24),
  },
});

export default Index;
