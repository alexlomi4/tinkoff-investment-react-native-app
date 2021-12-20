import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {RefreshControl, StyleProp, ViewStyle} from 'react-native';
import AccountInstrumentsView from './AccountInstrumentsView';
import {useLoadingFlag} from '../../../hooks/useLoadingFlag';
import {InvestmentContext} from '../../../context/InvestmentContext';
import {PortfolioPositionWithPrice} from 'tinkoff-investment-aggregate-service/src/types/model';
import {CurrencyPosition} from 'tinkoff-investment-js-client-api';
import {Totals} from 'tinkoff-investment-aggregate-service';
import AccountTotals from './AccountTotals';

type Props = {
  accountId?: string;
  onInstrumentPress: (figi: string, name: string) => void;
  style?: StyleProp<ViewStyle>;
};

function AccountInstrumentsContainer({onInstrumentPress, accountId}: Props) {
  const {serviceInstance} = useContext(InvestmentContext);

  const [totals, setTotals] = useState<Totals | null>(null);

  const fetchTotals = useCallback(async () => {
    const loadedTotals = await serviceInstance.getPortfolioTotal(accountId);
    setTotals(loadedTotals);
  }, [accountId, serviceInstance]);
  const [onLoadTotals, totalsLoading] = useLoadingFlag(fetchTotals);

  const [portfolio, setPortfolio] = useState({
    positions: [] as PortfolioPositionWithPrice[],
    currencyPositions: [] as CurrencyPosition[],
  });
  const {positions, currencyPositions} = portfolio;

  const fetchPortfolio = useCallback(async () => {
    const loadedData = await serviceInstance.getCurrentPositions(accountId);
    setPortfolio(loadedData);
  }, [accountId, serviceInstance]);
  const [onPortfolioLoad, portfolioLoading] = useLoadingFlag(fetchPortfolio);

  useEffect(() => {
    onLoadTotals();
    onPortfolioLoad();
  }, [onLoadTotals, onPortfolioLoad]);

  const [onRefresh, refreshing] = useLoadingFlag(
    useCallback(
      () => Promise.all([onPortfolioLoad(), onLoadTotals()]),
      [onLoadTotals, onPortfolioLoad],
    ),
    false,
  );

  const showTotals = !totalsLoading && !!totals;
  const header = useMemo(() => {
    if (!showTotals) {
      return null;
    }

    return <AccountTotals totals={totals!} />;
  }, [showTotals, totals]);

  return (
    <>
      {(showTotals || !portfolioLoading) && (
        <AccountInstrumentsView
          HeaderComponent={header}
          positions={positions}
          currencyPositions={currencyPositions}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onInstrumentPress={onInstrumentPress}
        />
      )}
    </>
  );
}

export default AccountInstrumentsContainer;
