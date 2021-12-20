import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, TextInput, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TOKEN} from '../contants/async-storage';
import {useAsyncStorageItem} from '../hooks/useAsyncStorageItem';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    flex: 1,
    margin: 12,
    minHeight: 40,
    padding: 10,
  },
});

type Props = {
  onLoginSuccess: (token: string) => void;
};

function LoginScreen({onLoginSuccess}: Props) {
  const [token, setToken] = useState('');

  const [savedToken] = useAsyncStorageItem(TOKEN);
  useEffect(() => {
    if (savedToken) {
      setToken(savedToken);
      if (onLoginSuccess) onLoginSuccess(savedToken);
    }
  }, [onLoginSuccess, savedToken]);

  const onLoginPress = async () => {
    await AsyncStorage.setItem(TOKEN, token);
    onLoginSuccess(token);
  };

  const {t} = useTranslation();

  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        placeholder={t('login.token')}
        value={token}
        onChangeText={setToken}
        multiline
      />
      <Button
        title={t('login.logIn')}
        onPress={onLoginPress}
        disabled={!token}
      />
    </SafeAreaView>
  );
}

export default LoginScreen;
