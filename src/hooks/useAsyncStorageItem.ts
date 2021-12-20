import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAsyncStorageItem(key: string) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    async function loadItem() {
      const savedValue = await AsyncStorage.getItem(key);
      setValue(savedValue);
    }
    loadItem();
  }, [key]);

  return [value];
}
