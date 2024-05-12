import React, { useState } from 'react';

import { SettingsContainer, Button, LanguageButton } from '@app/components';
import { useApp, useUser } from '@app/hooks';

const languages = [
  { key: 'screens.language.en', value: 'en' },
  {
    key: 'screens.language.tr',
    value: 'tr',
  },
];

const Index = () => {
  const { setDefaultLanguage, defaultLanguage } = useApp();
  const { updateProfileAction } = useUser();
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

  function onRestart() {
    setDefaultLanguage(currentLanguage);
    updateProfileAction({ appLanguage: currentLanguage });
  }

  return (
    <SettingsContainer title="screens.language.title">
      {languages.map((item, index) => {
        return (
          <LanguageButton
            key={index}
            setCurrentLanguage={setCurrentLanguage}
            value={item.value}
            label={item.key}
            currentLanguage={currentLanguage}
          />
        );
      })}
      <Button
        shadow
        text="screens.language.save"
        onPress={onRestart}
        disabled={currentLanguage === defaultLanguage}
      />
    </SettingsContainer>
  );
};

export default Index;
