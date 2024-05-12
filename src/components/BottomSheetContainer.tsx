import { ViewStyle } from 'react-native';
import React, {
  PropsWithChildren,
  forwardRef,
  memo,
  useCallback,
  useMemo,
} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';

import { useApp } from '@app/hooks';
import { Colors } from '@app/styles';

type Props = PropsWithChildren<{
  containerStyle?: ViewStyle;
  viewStyle?: ViewStyle;
}>;

const _BottomSheetContainer = forwardRef<BottomSheetModalRef, Props>(
  ({ children, containerStyle, viewStyle }, ref) => {
    const { isDarkMode } = useApp();
    const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
    const {
      animatedHandleHeight,
      animatedSnapPoints,
      animatedContentHeight,
      handleContentLayout,
    } = useBottomSheetDynamicSnapPoints(initialSnapPoints);
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        backgroundStyle={[
          containerStyle,
          {
            backgroundColor: isDarkMode ? Colors.dark2 : Colors.white,
          },
        ]}
        backdropComponent={renderBackdrop}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        enablePanDownToClose={true}
      >
        <BottomSheetView style={viewStyle} onLayout={handleContentLayout}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default memo(_BottomSheetContainer);
