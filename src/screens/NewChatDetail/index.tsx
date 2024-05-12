import React, { useCallback, useMemo, useRef } from 'react';
import { Keyboard, Platform, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import { Pages } from '@app/constants';
import { RootRouteProps } from '@app/types/navigation';
import { BottomSheetContainer, ChatDetailBottomSheet } from '@app/components';
import { useLayout } from '@app/hooks';
import type { MessageResponseProps } from '@app/types/redux/message';

import IosList from './IosList';
import Header from './Header';
import Input from './Input';
import AndroidList from './AndroidList';

function InteractiveKeyboard() {
  const { params } = useRoute<RootRouteProps<Pages.Chat_Details>>();

  const detailsRef = useRef<BottomSheetModalRef>(null);
  const flashListRef = useRef<FlashList<MessageResponseProps>>();
  const { onLayout, height } = useLayout();

  const onShowDetails = useCallback(() => {
    Keyboard.dismiss();
    detailsRef.current?.present();
  }, []);
  const onScrollToBottom = useCallback(() => {
    flashListRef.current?.scrollToOffset({
      offset: -69625.00260416667,
      animated: true,
    });
  }, []);

  const renderList = useMemo(() => {
    return Platform.OS === 'ios' ? (
      <IosList
        inputHeight={height}
        ref={
          flashListRef as React.MutableRefObject<
            FlashList<MessageResponseProps>
          >
        }
      />
    ) : (
      <AndroidList
        inputHeight={height}
        ref={
          flashListRef as React.MutableRefObject<
            FlashList<MessageResponseProps>
          >
        }
      />
    );
  }, [height]);

  return (
    <>
      <View style={styles.container}>
        <Header onShowDetails={onShowDetails} />
        {renderList}
        <Input onLayout={onLayout} onScrollToBottom={onScrollToBottom} />
      </View>
      <BottomSheetContainer
        containerStyle={styles.backgroundStyle}
        ref={detailsRef}
      >
        <ChatDetailBottomSheet
          receiverFullName={params?.receiverFullName}
          discoveryId={params?.discoveryId}
          receiverId={params?.receiverId}
          conversationId={params?.conversationId}
        />
      </BottomSheetContainer>
    </>
  );
}

export default InteractiveKeyboard;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  backgroundStyle: {
    borderRadius: 44,
  },
});
