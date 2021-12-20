import {Currency} from 'tinkoff-investment-js-client-api';

const UNIT_SIGN_MAP: {[currency in Currency]?: string} = {
  USD: '$',
  RUB: '₽',
  EUR: '€',
};

type UNIT = Currency | '%' | undefined;

function getSign(unit: UNIT): string {
  if (!unit || !(unit in UNIT_SIGN_MAP)) {
    return unit || '';
  }
  const symbol = UNIT_SIGN_MAP[unit as Currency];
  return symbol || unit || '';
}

export function formatPrice(
  priceValue: number | undefined,
  unit: UNIT,
  digits = 2,
): string {
  return `${
    priceValue ? (+priceValue.toFixed(digits)).toLocaleString('ru-RU') : ''
  } ${getSign(unit)}`;
}

export function formatBalance(balance: number, digits = 2): string {
  if (Math.trunc(balance) === balance) {
    return Intl.NumberFormat('en-US').format(+String(balance));
  }

  return Intl.NumberFormat('ru-RU').format(+balance.toFixed(digits));
}
