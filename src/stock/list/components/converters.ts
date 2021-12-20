import {PortfolioPositionWithPrice} from 'tinkoff-investment-aggregate-service';
import {Currency, CurrencyPosition} from 'tinkoff-investment-js-client-api';
import {InstrumentType} from 'tinkoff-investment-js-client-api';
import {getUniqueFigiInfoByCurrency} from 'tinkoff-investment-aggregate-service';

type Figi = string;

export type SectionData = {
  id: Currency | Figi;
  figi?: Figi;
  balance?: number;
  name: string;
  totalCost: number;
  expectedYieldValue?: number;
  expectedYieldPercent?: number;
  lastPrice?: number;
  currency?: Currency;
};

export type Section = {
  title: InstrumentType;
  data: SectionData[];
};

function currencyPositionToSectionData(
  positions: PortfolioPositionWithPrice[],
  {currency, balance}: CurrencyPosition,
): SectionData {
  const [figiInfo] = getUniqueFigiInfoByCurrency([currency]);
  const portfolioPosition = positions.find(
    ({figi, instrumentType}) =>
      instrumentType === 'Currency' && figi === figiInfo?.figi,
  );
  if (portfolioPosition) {
    return positionToSelectionData(portfolioPosition);
  }

  return {
    id: currency,
    name: currency,
    totalCost: balance,
    currency,
  };
}

function positionToSelectionData({
  currency,
  balance,
  averagePositionPrice,
  lastPrice,
  name,
  expectedYield,
  figi,
}: PortfolioPositionWithPrice): SectionData {
  return {
    id: figi,
    balance,
    currency: currency,
    name,
    totalCost: lastPrice ? lastPrice * balance : 0,
    expectedYieldValue: expectedYield?.value || 0,
    expectedYieldPercent:
      expectedYield && averagePositionPrice
        ? (expectedYield.value / (averagePositionPrice.value * balance)) * 100
        : 0,
    lastPrice,
    figi,
  };
}

export function portfolioPositionsToSections(
  positions: PortfolioPositionWithPrice[],
  currencyPositions: CurrencyPosition[],
): Section[] {
  const instrumentTypes = Array.from(
    new Set(positions.map(({instrumentType}) => instrumentType)),
  );
  if (!instrumentTypes.length) {
    return [];
  }

  const instrumentsData = instrumentTypes
    .filter(type => type !== 'Currency')
    .map(type => {
      const positionsByType = positions.filter(
        ({instrumentType}) => type === instrumentType,
      );
      return {
        title: type,
        data: positionsByType.map(positionToSelectionData),
      };
    });

  const currencyData: Section = {
    title: 'Currency',
    data: currencyPositions.map(currencyPosition =>
      currencyPositionToSectionData(positions, currencyPosition),
    ),
  };

  return [...instrumentsData, currencyData];
}
