import React, {useCallback, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../login/LoginScreen';
import StockDetailsScreen from '../stock/details/StockDetailsScreen';
import {useTranslation} from 'react-i18next';
import {RootStackParamList} from './types';
import {InvestmentProvider} from '../context/InvestmentContext';
import StockListScreen from '../stock/list/StockListScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const {t} = useTranslation();

  const [currentToken, setCurrentToken] = useState('');

  const onLoginSuccess = useCallback((token: string) => {
    setCurrentToken(token);
  }, []);

  return (
    <InvestmentProvider isProd token={currentToken}>
      <NavigationContainer>
        <Stack.Navigator>
          {!currentToken ? (
            <Stack.Screen
              name={'Login'}
              options={{title: t('login.pleaseLogin')}}>
              {props => (
                <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />
              )}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name={'StockList'} component={StockListScreen} />
              <Stack.Screen
                name={'StockDetails'}
                component={StockDetailsScreen}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </InvestmentProvider>
  );
}

export default React.memo(RootNavigator);
