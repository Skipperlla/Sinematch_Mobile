import { useCallback } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';
import crashlytics from '@react-native-firebase/crashlytics';

import { WEB_CLIENT_ID, IOS_CLIENT_ID, WEB_CLIENT_ID_DEV } from '@env';
import {
  useApp,
  useAppNavigation,
  useConversation,
  useDiscovery,
  useMedia,
  usePurchase,
  useUser,
} from '@app/hooks';
import { Pages } from '@app/constants';
import { Platform } from 'react-native';

GoogleSignin.configure({
  webClientId: __DEV__ ? WEB_CLIENT_ID : WEB_CLIENT_ID_DEV,
  iosClientId: IOS_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export default function () {
  const { setSelectedFavorites } = useMedia();
  const {
    loginWithProviderAction,
    User,
    setPicture,
    isLoggedInAction,
    updateProfileAction,
  } = useUser();
  const { setIsStartedAccountSetup, defaultLanguage } = useApp();
  const { fetchPurchaseInfoAction } = usePurchase();
  const { allConversationsAction } = useConversation();
  const { likesAction } = useDiscovery();

  const navigation = useAppNavigation();
  // TODO: Fix this
  const navigate = useCallback((page: any) => navigation.navigate(page), []);
  const loginWithGoogle = useCallback(async () => {
    await GoogleSignin.hasPlayServices();
    const {
      user: { email, id, name },
    } = await GoogleSignin.signIn();
    loginWithProviderAction({
      provider: 'google',
      providerId: id,
      email,
      fullName: String(name),
      uuid: String(User?.uuid),
    }).then(({ user, statusCode }) => {
      if (statusCode === 201 || !user.isCompletedProfile) {
        setIsStartedAccountSetup(true);
        setPicture(user?.avatars ?? []);
        setSelectedFavorites([
          ...(user?.favMovies ?? []),
          ...(user?.favSeries ?? []),
        ]);
        navigate(Pages.FullName);
      } else
        isLoggedInAction().then(async () => {
          const data = await fetchPurchaseInfoAction();
          updateProfileAction({
            platform: Platform.OS,
            appLanguage: defaultLanguage,
            plan: data.activeSubscriptions.length ? 2 : 1,
          });
          allConversationsAction(20);
          likesAction(10);
          crashlytics().setUserId(String(User?.uuid));
        });
    });
  }, [User?.uuid]);
  const loginWithApple = useCallback(async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      const { email, sub } = jwt_decode<{ email: string; sub: string }>(
        appleAuthRequestResponse.identityToken as string,
      );

      const fullName =
        appleAuthRequestResponse.realUserStatus === 2
          ? `${appleAuthRequestResponse.fullName?.givenName} ${appleAuthRequestResponse.fullName?.familyName}`
          : null;
      loginWithProviderAction({
        provider: 'apple',
        providerId: sub,
        email,
        fullName,
        uuid: String(User?.uuid),
      }).then(({ statusCode, user }) => {
        if (statusCode === 201 || !user.isCompletedProfile) {
          setIsStartedAccountSetup(true);
          setPicture(user?.avatars ?? []);
          setSelectedFavorites([
            ...(user?.favMovies ?? []),
            ...(user?.favSeries ?? []),
          ]);
          navigate(Pages.FullName);
        } else
          isLoggedInAction().then(async () => {
            const data = await fetchPurchaseInfoAction();
            updateProfileAction({
              platform: Platform.OS,
              appLanguage: defaultLanguage,
              plan: data.activeSubscriptions.length ? 2 : 1,
            });
            allConversationsAction(20);
            likesAction(10);
            crashlytics().setUserId(String(User?.uuid));
          });
      });
    }
  }, [User?.uuid]);

  return {
    loginWithGoogle,
    loginWithApple,
  };
}
