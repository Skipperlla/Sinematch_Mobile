import React, { memo, useCallback } from 'react';
import {
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
  Text as RNText,
} from 'react-native';
import dayjs from 'dayjs';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNotify } from 'rn-notify';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { Pages, ScreenSizes } from '@app/constants';
import { useApp, useAppNavigation, useTranslation } from '@app/hooks';
import { Colors } from '@app/styles';
import { FastImage, Icon, Text } from '@app/components';
import { rs } from '@app/utils';
import type { MessageStatusProps } from '@app/types/redux/message';
import type { ImageProps } from '@app/types/redux/user';
import type { RootRouteProps } from '@app/types/navigation';

type Props = {
  text?: string;
  createdAt?: Date;
  status?: MessageStatusProps;
  isRead: boolean;
  isSender: boolean;
  image?: ImageProps;
};

const _Message = ({
  text,
  createdAt,
  status,
  isRead,
  isSender,
  image,
}: Props) => {
  const { isDarkMode } = useApp();
  const { t } = useTranslation();
  const { params } = useRoute<RootRouteProps<Pages.Chat_Details>>();
  const notify = useNotify();
  const navigation = useAppNavigation();
  const onClipboard = useCallback(() => {
    Clipboard.setString(text || '');
    notify.success({
      message: t('components.card.messageCard.copiedToClipboard'),
      duration: 2500,
    });
  }, [text]);
  const navigate = useCallback(() => {
    navigation.navigate(Pages.Chat_Image, {
      uri: image?.Location,
      conversationId: params.conversationId,
    });
  }, [image?.Location]);

  const renderText = () => {
    const words = String(text).split(' ');
    return words.map((word, index) => {
      if (/https?:\/\/[^\s]+/g.test(word)) {
        return (
          <Text
            key={index}
            size="bodySmall"
            fontFamily="bold"
            isUseTranslation={false}
            text={String(word + ' ')}
            color="lightBlue"
            style={styles.underline}
            letterSpacing={0.2}
            onPress={() => Linking.openURL(word)}
          />
        );
      } else {
        return (
          <Text
            key={index}
            size="bodySmall"
            fontFamily="medium"
            isUseTranslation={false}
            text={String(word + ' ')}
            color={!isSender && !isDarkMode ? 'grey900' : 'white'}
            letterSpacing={0.2}
          />
        );
      }
    });
  };

  return (
    <View
      style={[
        {
          backgroundColor: isSender
            ? Colors.primary500
            : isDarkMode
            ? Colors.dark3
            : Colors.grey100,
          alignSelf: isSender ? 'flex-end' : 'flex-start',
        },
        styles.container,
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        disabled={!text}
        onLongPress={onClipboard}
      >
        {image?.Location && (
          <TouchableOpacity activeOpacity={1} onPress={navigate}>
            <FastImage
              uri={image?.Location}
              width={240}
              height={240}
              borderRadius={10}
              loadingIndicatorColor={isSender ? Colors.white : Colors.black}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.5)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            >
              <Icon
                icon={`bold_${image?.imageType}`}
                size={rs(20)}
                color={Colors.white}
              />
              <Text
                size="bodyMedium"
                fontFamily="bold"
                align="right"
                text={`components.card.messageCard.${image?.imageType}`}
                color="white"
                letterSpacing={0.2}
              />
            </LinearGradient>
          </TouchableOpacity>
        )}
        {text && <RNText>{renderText()}</RNText>}
        <View style={styles.timeContainer}>
          <Text
            size="bodyXSmall"
            fontFamily="medium"
            align="right"
            text={dayjs(createdAt).format('HH:mm')}
            color={!isSender && !isDarkMode ? 'grey500' : 'grey300'}
            letterSpacing={0.2}
          />
          {isSender && (
            <Icon
              icon={
                status === 'delivered'
                  ? isRead
                    ? 'double_check'
                    : 'check'
                  : 'light_time_circle'
              }
              size={rs(14)}
              color={!isSender && !isDarkMode ? Colors.grey900 : 'white'}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: rs(10),
    paddingVertical: rs(8),
    marginBottom: rs(12),
    gap: rs(8),
    maxWidth: ScreenSizes.screenWidth * 0.7,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: '100%',
    gap: rs(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: rs(10),
    paddingVertical: rs(4),
  },
  timeContainer: {
    marginTop: rs(4),
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(4),
    justifyContent: 'flex-end',
  },
});

export default memo(_Message);
