import React, {useCallback} from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import {Currency} from 'tinkoff-investment-js-client-api';
import {formatPrice, formatBalance} from '../../../../helpers/price-helpers';
import ExpectedYieldPrice from './ExpectedYieldPrice';

const styles = StyleSheet.create({
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  nameColumn: {
    flex: 1,
  },
  priceColumn: {
    marginLeft: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalAmount: {
    alignSelf: 'flex-end',
    paddingBottom: 5,
  },
});

type Props = {
  id: string;
  balance?: number;
  name: string;
  currency?: Currency;
  totalCost: number;
  expectedYieldValue?: number;
  expectedYieldPercent?: number;
  lastPrice?: number;
  onPress: (figi: string, name: string) => void;
  style?: StyleProp<ViewStyle>;
};

function InstrumentRow({
  id,
  name,
  balance,
  totalCost,
  expectedYieldValue,
  expectedYieldPercent,
  lastPrice,
  currency,
  onPress,
  style,
}: Props) {
  const onPressCallback = useCallback(() => {
    onPress(id, name);
  }, [id, name, onPress]);

  return (
    <TouchableOpacity onPress={onPressCallback}>
      <View style={[styles.row, style]}>
        <View style={styles.nameColumn}>
          <Text style={styles.name}>{name}</Text>
          <Text>
            {balance ? `x ${formatBalance(balance)}  ` : ''}
            {!!lastPrice && <Text>{formatPrice(lastPrice, currency)}</Text>}
          </Text>
        </View>
        <View style={styles.priceColumn}>
          <Text style={styles.totalAmount}>
            {formatPrice(totalCost, currency)}
          </Text>
          {!!expectedYieldValue && (
            <ExpectedYieldPrice
              value={expectedYieldValue}
              currency={currency}
              percent={expectedYieldPercent}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default InstrumentRow;
