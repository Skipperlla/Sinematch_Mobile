import { View, Pressable } from 'react-native';
import React, { memo, useMemo } from 'react';

import { useStyle } from '@app/hooks';
import { rs } from '@app/utils';
import { FastImage, Icon } from '@app/components';
import { Colors } from '@app/styles';

type Variant = 'default' | 'online' | 'offline' | 'edit' | 'add';
type Props = {
  variant: Variant;
  uri: string;
  avatarSize: number;
  statusSize: number;
  onPress?: () => void;
};

const BORDER_RADIUS = 999;

const useAvatarStyle = (avatarSize: number) => {
  return useStyle(
    () => ({
      width: rs(avatarSize),
      height: rs(avatarSize),
      borderRadius: BORDER_RADIUS,
    }),
    [],
  );
};
const useStatusStyle = (variant: Variant, statusSize: number) => {
  return useStyle(
    () => ({
      width: statusSize,
      height: statusSize,
      borderWidth: variant === 'edit' || variant === 'add' ? 0 : rs(1.6),
      borderRadius: 999,
      borderColor: Colors.white,
      position: 'absolute',
      right: 0,
      bottom: 0,
      backgroundColor:
        variant === 'edit' || variant === 'add'
          ? 'transparent'
          : variant === 'online'
          ? Colors.primary500
          : Colors.grey400,
    }),
    [],
  );
};

const _Avatar = ({ variant, uri, avatarSize, statusSize, onPress }: Props) => {
  const style = useAvatarStyle(avatarSize);
  const statusStyle = useStatusStyle(variant, statusSize);
  const status = useMemo(() => {
    switch (variant) {
      case 'online':
        return <View style={statusStyle} />;
      case 'offline':
        return <View style={statusStyle} />;
      case 'edit':
        return (
          <Icon
            icon="bold_edit_square"
            size={statusSize}
            color={Colors.primary500}
            style={statusStyle}
          />
        );
      case 'add':
        return (
          <Icon
            icon="bold_plus"
            size={statusSize}
            color={Colors.primary500}
            style={statusStyle}
          />
        );
      default:
        return null;
    }
  }, []);

  return (
    <Pressable style={style} onPress={onPress}>
      <FastImage
        uri={uri}
        width={avatarSize}
        height={avatarSize}
        borderRadius={BORDER_RADIUS}
      />
      {status}
    </Pressable>
  );
};

export default memo(_Avatar);
