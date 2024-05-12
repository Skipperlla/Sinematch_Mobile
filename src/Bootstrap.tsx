import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { NotifyProvider } from 'rn-notify';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PortalProvider } from '@gorhom/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SplashScreen from 'react-native-splash-screen';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// AsyncStorage.clear();

import store, { persistor } from '@app/store';
import { useStyle } from '@app/hooks';
import Navigation from '@app/navigation/Index';
import '@app/lang/_i18n';

const queryClient = new QueryClient();

import { DiscoveryContext, SocketContext } from './utils';
import { CloudMessaging, Initializing } from './components';
import { StatusBar } from 'react-native';

function App() {
  const style = useStyle(
    () => ({
      flex: 1,
    }),
    [],
  );

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle="dark-content" hidden />
      <KeyboardProvider statusBarTranslucent>
        <GestureHandlerRootView style={style}>
          <PortalProvider>
            <NotifyProvider>
              <Provider store={store}>
                <SafeAreaProvider>
                  <DiscoveryContext.DiscoveryProvider>
                    <PersistGate loading={null} persistor={persistor}>
                      <BottomSheetModalProvider>
                        <SocketContext.SocketProvider>
                          <CloudMessaging />
                          <Initializing />
                          <Navigation />
                        </SocketContext.SocketProvider>
                      </BottomSheetModalProvider>
                    </PersistGate>
                  </DiscoveryContext.DiscoveryProvider>
                </SafeAreaProvider>
              </Provider>
            </NotifyProvider>
          </PortalProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </QueryClientProvider>
  );
}

export default App;
