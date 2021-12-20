import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Totals} from 'tinkoff-investment-aggregate-service';
import {formatPrice} from '../../../helpers/price-helpers';
import ExpectedYieldPrice from './row/ExpectedYieldPrice';

const styles = StyleSheet.create({
  profit: {
    marginBottom: 10,
    marginTop: 6,
    textAlign: 'center',
  },
  totalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

type Props = {
  totals: Totals;
};

function AccountTotals({totals: {payIn, profit, profitPercent}}: Props) {
  return (
    <>
      <Text style={styles.totalHeader}>
        {formatPrice(profit + payIn, 'RUB', 0)}
      </Text>
      <ExpectedYieldPrice
        style={styles.profit}
        value={profit}
        currency={'RUB'}
        percent={profitPercent}
      />
    </>
  );
}

export default AccountTotals;
