import { TouchableOpacity } from 'react-native';
import React, { memo, useCallback } from 'react';

import { useStyle } from '@app/hooks';
import { Text, Radio } from '@app/components';

type Props = {
  setCurrentLanguage: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  label: string;
  currentLanguage: string;
};

const _Language = ({
  setCurrentLanguage,
  value,
  label,
  currentLanguage,
}: Props) => {
  const onChangeCurrentLanguage = useCallback(
    () => setCurrentLanguage(value),
    [],
  );
  const style = useStyle(
    () => ({
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }),
    [],
  );

  return (
    <TouchableOpacity
      onPress={onChangeCurrentLanguage}
      disabled={currentLanguage === value}
      style={style}
    >
      <Text text={label} size="bodyXLarge" fontFamily="semiBold" />
      <Radio
        width={20}
        disabled
        height={20}
        checked={currentLanguage === value}
        ellipseSize={10}
      />
    </TouchableOpacity>
  );
};

export default memo(_Language);
