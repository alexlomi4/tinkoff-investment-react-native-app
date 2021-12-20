import React, {useCallback, useContext} from 'react';
import {Text, StyleSheet} from 'react-native';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/types';
import {InvestmentContext} from '../../context/InvestmentContext';
import {useFetchData} from '../../hooks/useFetchData';
import {formatPrice} from '../../helpers/price-helpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
});

const SAFE_AREA_EDGES: readonly Edge[] = ['bottom', 'left', 'right'];

type ScreenRouteProp = RouteProp<RootStackParamList, 'StockDetails'>;

function StockDetailsScreen() {
  const {name, figi} = useRoute<ScreenRouteProp>().params;

  const {serviceInstance} = useContext(InvestmentContext);
  const fetchInstrumentTotalInfo = useCallback(
    () => serviceInstance.getPositionTotalDetails(figi),
    [figi, serviceInstance],
  );

  const [instrumentInfo, instrumentInfoFetching] = useFetchData(
    fetchInstrumentTotalInfo,
    null,
  );

  return (
    <SafeAreaView style={styles.container} edges={SAFE_AREA_EDGES}>
      <Text>{name}</Text>
      {instrumentInfoFetching && <Text>LOADING</Text>}
      {!instrumentInfoFetching && instrumentInfo && (
        <>
          <Text>
            {`lastPrice:  ${formatPrice(
              instrumentInfo.lastPrice,
              instrumentInfo.currency,
            )}`}
          </Text>
          <Text>{`averagePrice: ${formatPrice(
            Math.abs(
              ((instrumentInfo.lastPrice ?? 0) * instrumentInfo.balance -
                instrumentInfo.totalProfit) /
                instrumentInfo.balance,
            ),
            instrumentInfo.currency,
          )}`}</Text>
          <Text>{`totalProfit: ${formatPrice(
            instrumentInfo.totalProfit,
            instrumentInfo.currency,
          )}`}</Text>
        </>
      )}
    </SafeAreaView>
  );
}

export default React.memo(StockDetailsScreen);
