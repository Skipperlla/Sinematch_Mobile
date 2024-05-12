import { ScrollView, FlatList } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useUser } from '@app/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { rs } from '@app/utils';
import { CompareProfile, ImageModal } from '@app/components';

const Index = () => {
  const { myProfileMediaAction, MyProfile, User } = useUser();
  const { bottom } = useSafeAreaInsets();
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageCurrentIndex, setImageCurrentIndex] = useState(0);
  const carouselRef = useRef<FlatList>(null);
  const filteredAvatars = User?.avatars?.filter((item) => item?.Location);

  const onShowModal = useCallback((index: number) => {
    setImageCurrentIndex(index);
    setModalVisible(true);
  }, []);
  const onCloseModal = useCallback(() => setModalVisible(false), []);

  useEffect(() => {
    myProfileMediaAction(String(User?.uuid));
  }, []);

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: rs(bottom) ?? rs(24),
        }}
        bounces={false}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <CompareProfile.TabBar
          isModalVisible={isModalVisible}
          showMoreCircle={false}
        />
        <CompareProfile.Carousel
          onShowModal={onShowModal}
          ref={carouselRef}
          avatars={filteredAvatars ?? []}
        />
        <CompareProfile.Info data={User} />
        <CompareProfile.MediaContainer
          movie={MyProfile?.movies}
          series={MyProfile?.series}
          genres={MyProfile?.genres}
          movieTitle="screens.myProfile.favoriteMovies"
          seriesTitle="screens.myProfile.favoriteSeries"
          genreTitle="screens.myProfile.favoriteGenres"
        />
      </ScrollView>
      <ImageModal
        isVisible={isModalVisible}
        onClose={onCloseModal}
        avatars={filteredAvatars ?? []}
        imageCurrentIndex={imageCurrentIndex}
        carouselRef={carouselRef}
      />
    </>
  );
};

export default Index;
