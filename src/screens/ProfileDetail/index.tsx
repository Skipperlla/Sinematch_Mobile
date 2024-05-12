import { ScrollView, FlatList, StyleSheet } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

import {
  useAppNavigation,
  useConversation,
  useDiscovery,
  useUser,
} from '@app/hooks';
import {
  LoadingIndicator,
  ImageModal,
  BottomSheetContainer,
  ProfileDetailSettingsBottomSheet,
  CompareProfile as CompareProfileComponent,
} from '@app/components';
import { Pages } from '@app/constants';
import { SocketContext, rs } from '@app/utils';
import type { RootRouteProps } from '@app/types/navigation';

import MediaSelector from './MediaSelector';
import { UserService } from '@app/api';
import { useQuery } from '@tanstack/react-query';

const Profile_Detail = () => {
  const { User, blockUserAction } = useUser();
  const { setDiscoveries, setLikes, setIgnored } = useDiscovery();
  const { params } = useRoute<RootRouteProps<Pages.Profile_Detail>>();
  const { bottom } = useSafeAreaInsets();
  const { endConversationAction } = useConversation();
  const { dismissAll } = useBottomSheetModal();
  const { socket } = SocketContext.useSocketContext();
  const navigation = useAppNavigation();
  const carouselRef = useRef<FlatList>(null);
  const settingsRef = useRef<BottomSheetModalRef>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [imageCurrentIndex, setImageCurrentIndex] = useState(0);
  const [currentState, setCurrentState] = useState('common');

  const onShowModal = useCallback((index: number) => {
    setImageCurrentIndex(index);
    setModalVisible(true);
  }, []);
  const onShowSettings = useCallback(() => settingsRef.current?.present(), []);
  const onBlockUser = useCallback(async () => {
    await blockUserAction(params?.userId);

    if (params?.discoveryId && params?.conversationId) {
      await endConversationAction({
        receiverId: params?.userId,
        conversationId: params?.conversationId,
      });

      socket?.emit('leaveConversation', params?.conversationId);
    } else {
      setDiscoveries(params?.userId);
      setLikes(params?.userId);
      setIgnored(params?.userId);
      socket?.emit('blockUser', {
        receiverId: params?.userId,
        senderId: User?.uuid,
      });
    }

    dismissAll();
    if (params?.isSwipeBackScreen) {
      navigation.navigate(Pages.Matches);
    } else navigation.goBack();
  }, []);

  const { data, isLoading } = useQuery(
    [params?.userId],
    () => UserService.compareProfile(params?.userId),
    {
      onError: () => navigation.goBack(),
    },
  );

  if (isLoading) return <LoadingIndicator />;

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: rs(bottom) ?? rs(24),
        }}
        bounces={false}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <CompareProfileComponent.TabBar
          onShowSettings={onShowSettings}
          isModalVisible={isModalVisible}
        />
        <CompareProfileComponent.Carousel
          onShowModal={onShowModal}
          ref={carouselRef}
          avatars={data?.receiver?.avatars ?? []}
        />
        <CompareProfileComponent.Info data={data?.receiver ?? {}} />
        <MediaSelector
          currentState={currentState}
          setCurrentState={setCurrentState}
        />
        {currentState === 'common' ? (
          <CompareProfileComponent.MediaContainer
            movie={data?.movie ?? []}
            series={data?.series ?? []}
            genres={data?.commonGenres ?? []}
            movieTitle="screens.profileDetail.commonMovies"
            seriesTitle="screens.profileDetail.commonSeries"
            genreTitle="screens.profileDetail.commonGenres"
          />
        ) : (
          <CompareProfileComponent.MediaContainer
            movie={data?.receiverMedia?.movie ?? []}
            series={data?.receiverMedia?.series ?? []}
            genres={data?.receiverMedia?.genres ?? []}
            movieTitle="screens.profileDetail.favoriteMovies"
            seriesTitle="screens.profileDetail.favoriteSeries"
            genreTitle="screens.profileDetail.favoriteGenres"
          />
        )}
      </ScrollView>
      <ImageModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        avatars={data?.receiver?.avatars ?? []}
        imageCurrentIndex={imageCurrentIndex}
        carouselRef={carouselRef}
      />
      <BottomSheetContainer
        containerStyle={styles.backgroundStyle}
        ref={settingsRef}
      >
        <ProfileDetailSettingsBottomSheet
          onBlockUser={onBlockUser}
          userId={params?.userId}
        />
      </BottomSheetContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scene: {
    flex: 1,
  },
  tabBar: {},
  backgroundStyle: {
    borderRadius: 44,
  },
});

export default Profile_Detail;
