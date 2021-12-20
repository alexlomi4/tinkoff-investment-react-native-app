import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <RootNavigator />
      </I18nextProvider>
    </SafeAreaProvider>
  );
}

export default App;
