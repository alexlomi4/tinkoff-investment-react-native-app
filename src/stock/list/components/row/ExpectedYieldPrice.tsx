import React from 'react';
import {StyleProp, Text, TextStyle, StyleSheet} from 'react-native';
import {formatPrice} from '../../../../helpers/price-helpers';
import {Currency} from 'tinkoff-investment-js-client-api';

const styles = StyleSheet.create({
  loss: {
    color: '#ea193c',
  },
  price: {
    fontSize: 13,
    fontWeight: '500',
  },
  profit: {
    color: '#489a4c',
  },
});

type Props = {
  value?: number;
  percent?: number;
  currency?: Currency;
  style?: StyleProp<TextStyle>;
};

function ExpectedYieldPrice({value, currency, percent, style}: Props) {
  return (
    <Text
      style={[
        styles.price,
        value && value < 0 ? styles.loss : styles.profit,
        style,
      ]}>
      {`${formatPrice(value, currency)}(${formatPrice(percent, '%')})`}
    </Text>
  );
}

export default ExpectedYieldPrice;
