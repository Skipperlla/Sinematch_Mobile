import {
  KeyboardTypeOptions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Masks } from 'react-native-mask-input';

import { rs } from '@app/utils';
import {
  Icon,
  Input,
  LoadingIndicator,
  MaskedInput,
  Text,
} from '@app/components';
import { useApp, useAppNavigation, useUser } from '@app/hooks';
import { Colors, Fonts, Sizes } from '@app/styles';
import { Pages } from '@app/constants';

type Props = {
  label: string;
  value: string;
  isInfo?: boolean;
  placeholderText?: string;
  keyboardType: KeyboardTypeOptions | undefined;
} & TouchableOpacity['props'];

const _Field = ({
  value,
  label,
  isInfo,
  placeholderText,
  keyboardType,
}: Props) => {
  const { defaultLanguage, isDarkMode } = useApp();
  const { updateProfileAction, updateInfoAction } = useUser();
  const [defaultValue, setText] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const navigation = useAppNavigation();

  const onSave = useCallback(() => {
    setIsLoading(true);
    const action = isInfo ? updateInfoAction : updateProfileAction;
    action({ [label]: defaultValue })
      .then(() => {
        const timer = setTimeout(() => {
          inputRef.current?.blur();
        }, 100);
        setIsLoading(false);
        return () => clearTimeout(timer);
      })
      .finally(() => setIsLoading(false));
  }, [defaultValue]);
  const navigate = useCallback(() => {
    navigation.navigate(Pages.Single_Edit_Profile, {
      editType: 'Gender',
    });
  }, []);
  const rightIcon = useMemo(() => {
    return (
      <TouchableOpacity onPress={label === 'gender' ? navigate : onSave}>
        {isLoading ? (
          <LoadingIndicator />
        ) : label === 'gender' ? (
          <Icon icon="curved_edit" size={rs(20)} color={Colors.primary500} />
        ) : (
          <Text
            fontFamily="semiBold"
            size="bodyMedium"
            text="screens.editProfile.save"
            color="primary500"
            style={styles.saveText}
          />
        )}
      </TouchableOpacity>
    );
  }, [onSave, isLoading]);

  return (
    <View style={styles.wrapper}>
      <Text
        fontFamily="medium"
        size="bodyMedium"
        text={`components.button.editProfile.${label}`}
      />

      {label === 'birthday' ? (
        <MaskedInput
          ref={inputRef}
          returnKeyType="done"
          value={String(defaultValue)}
          placeholderText={placeholderText}
          onChangeText={setText}
          keyboardType="number-pad"
          mask={
            defaultLanguage === 'tr' ? Masks.DATE_DDMMYYYY : Masks.DATE_MMDDYYYY
          }
          rightIcon={rightIcon}
          onSubmitEditing={onSave}
        />
      ) : label === 'gender' ? (
        <View
          style={[
            {
              backgroundColor: isDarkMode ? Colors.dark2 : Colors.grey50,
            },
            styles.genderContainer,
          ]}
        >
          <Text
            fontFamily="semiBold"
            size="bodyMedium"
            text={value}
            style={styles.genderText}
          />
          {rightIcon}
        </View>
      ) : (
        <Input
          ref={inputRef}
          returnKeyType="done"
          defaultValue={String(defaultValue)}
          onChangeText={setText}
          autoCapitalize={label === 'userName' ? 'none' : 'words'}
          onSubmitEditing={onSave}
          blurOnSubmit
          keyboardType={keyboardType}
          placeholderText={placeholderText}
          multiline={label === 'biography'}
          style={[
            styles.text,
            {
              color: isDarkMode ? Colors.white : Colors.grey900,
            },
          ]}
          rightIcon={rightIcon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: rs(12),
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rs(24),
    minHeight: rs(56),
    borderRadius: 16,
    paddingVertical: rs(16),
  },
  text: {
    letterSpacing: 0.2,
    flex: 1,
    fontFamily: Fonts.semiBold,
    fontSize: Sizes.bodyMedium,
  },
  icon: {
    marginLeft: rs(12),
  },
  genderContainer: {
    paddingHorizontal: rs(20),
    minHeight: rs(56),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  genderText: {
    flex: 1,
  },
  saveText: {
    marginLeft: rs(6),
  },
});

export default memo(_Field);
