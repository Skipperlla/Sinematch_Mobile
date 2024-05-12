import { useCallback } from 'react';
import { Permission, request } from 'react-native-permissions';
import { Linking, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

type PositionProps = {
  latitude: number;
  longitude: number;
};

export default function useGetPermission() {
  const getPermission = useCallback(
    async (IOSPermission: Permission, AndroidPermission: Permission) => {
      return await request(
        Platform.OS === 'ios' ? IOSPermission : AndroidPermission,
      ).then((status) => {
        return status;
      });
    },
    [],
  );
  const openSettings = useCallback(() => {
    return Linking.openSettings();
  }, []);
  const getCurrentPosition = useCallback((): Promise<PositionProps> => {
    return new Promise((resolve, reject) =>
      Geolocation.getCurrentPosition(
        (position) =>
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        (error) => reject(error),
      ),
    );
  }, []);

  return {
    getPermission,
    openSettings,
    getCurrentPosition,
  };
}
