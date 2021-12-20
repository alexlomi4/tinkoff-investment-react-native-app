import React, {useCallback, useContext, useMemo, useState} from 'react';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {InvestmentContext} from '../../context/InvestmentContext';
import AccountInstrumentsContainer from './components/AccountInstrumentsContainer';
import {Dimensions, ListRenderItem, Text, View, StyleSheet} from 'react-native';
import {UserAccount} from 'tinkoff-investment-js-client-api';
import {useFetchData} from '../../hooks/useFetchData';
import CustomCarousel from '../../components/CustomCarousel';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
  accountTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 20,
  },
  carousel: {
    flex: 1,
    paddingHorizontal: 10,
  },
  safeArea: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 0,
  },
});

const SAFE_AREA_EDGES: readonly Edge[] = ['bottom', 'left', 'right'];

type ScreenNavigationProp = NativeStackNavigationProp<
RootStackParamList,
'StockList'
>;

type UserAccountOrEmpty = UserAccount | Record<string, never>;

function StockListScreen() {
  const [currentAccountId, setCurrentAccountId] = useState<
  string | undefined
  >();
  const {serviceInstance} = useContext(InvestmentContext);
  const fetchAccounts = useCallback(
    () => serviceInstance.getAccounts(),
    [serviceInstance],
  );
  const [loadedAccounts, accountsLoading] = useFetchData<UserAccount[]>(
    fetchAccounts,
    [],
  );
  const accounts = useMemo<UserAccountOrEmpty[]>(() => {
    return [{}, ...loadedAccounts];
  }, [loadedAccounts]);

  const navigation = useNavigation<ScreenNavigationProp>();
  const onInstrumentPress = useCallback(
    (figi: string, name: string) => {
      navigation.navigate({
        name: 'StockDetails',
        params: {figi, name},
      });
    },
    [navigation],
  );

  const renderInstrumentsTab = useCallback<ListRenderItem<UserAccountOrEmpty>>(
    ({item: {brokerAccountId}}) => (
      <AccountInstrumentsContainer
        onInstrumentPress={onInstrumentPress}
        accountId={brokerAccountId}
      />
    ),
    [onInstrumentPress],
  );

  const width = Dimensions.get('window').width - 20;
  const onSnapToItem = useCallback(
    (index: number) => {
      setCurrentAccountId(accounts[index].brokerAccountId);
    },
    [accounts],
  );

  const currentAccount = accounts.find(
    ({brokerAccountId}) => brokerAccountId === currentAccountId,
  );

  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea} edges={SAFE_AREA_EDGES}>
      <View style={styles.carousel}>
        <Text style={styles.accountTitle}>
          {currentAccount?.brokerAccountType ?? t('home.allAccounts')}
        </Text>
        {!accountsLoading && accounts.length ? (
          <CustomCarousel
            sliderWidth={width}
            itemWidth={width}
            data={accounts}
            renderItem={renderInstrumentsTab}
            onSnapToItem={onSnapToItem}
            bounces={false}
          />
        ) : (
          <AccountInstrumentsContainer
            onInstrumentPress={onInstrumentPress}
            accountId={currentAccountId}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default React.memo(StockListScreen);
