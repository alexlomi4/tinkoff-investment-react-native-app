import React, {useCallback, useMemo} from 'react';
import {PortfolioPositionWithPrice} from 'tinkoff-investment-aggregate-service';
import InstrumentRow from './row/InstrumentRow';
import {
  ListRenderItem,
  SectionList,
  Text,
  View,
  ListRenderItemInfo,
  RefreshControlProps,
  SectionListProps,
  StyleSheet,
} from 'react-native';
import {portfolioPositionsToSections, Section, SectionData} from './converters';
import {CurrencyPosition} from 'tinkoff-investment-js-client-api';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  item: {
    paddingVertical: 12,
  },
  itemSeparator: {
    borderBottomColor: '#4C5E8B4C',
    borderBottomWidth: 1,
  },
  sectionSeparator: {
    paddingBottom: 15,
  },
  title: {
    color: '#315d8e',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

type Props = {
  positions: PortfolioPositionWithPrice[];
  currencyPositions: CurrencyPosition[];
  onInstrumentPress: (figi: string, name: string) => void;
  refreshControl?: React.ReactElement<RefreshControlProps> | undefined;
  HeaderComponent?: SectionListProps<Section>['ListHeaderComponent'];
};

const keyExtractor = ({id}: {id: string}) => id;

function AccountInstrumentsView({
  positions,
  currencyPositions,
  onInstrumentPress,
  refreshControl,
  HeaderComponent,
}: Props) {
  const renderSectionHeader = useCallback(
    ({section: {title}}) => <Text style={styles.title}>{title}</Text>,
    [],
  );
  const renderSectionSeparator = useCallback(
    () => <View style={styles.sectionSeparator} />,
    [],
  );

  const renderItemSeparator = useCallback(
    () => <View style={styles.itemSeparator} />,
    [],
  );
  let renderItem: (
    info: ListRenderItemInfo<SectionData>,
  ) => React.ReactElement | null;
  renderItem = useCallback<ListRenderItem<SectionData>>(
    ({
      item: {
        name,
        balance,
        id,
        expectedYieldValue,
        totalCost,
        lastPrice,
        currency,
        expectedYieldPercent,
      },
    }) => (
      <InstrumentRow
        style={styles.item}
        id={id}
        name={name}
        balance={balance}
        currency={currency}
        totalCost={totalCost}
        expectedYieldValue={expectedYieldValue}
        expectedYieldPercent={expectedYieldPercent}
        lastPrice={lastPrice}
        onPress={onInstrumentPress}
      />
    ),
    [onInstrumentPress],
  );

  const sections = useMemo(
    () => portfolioPositionsToSections(positions, currencyPositions),
    [positions, currencyPositions],
  );

  return (
    <SectionList
      ListHeaderComponent={HeaderComponent}
      contentContainerStyle={styles.container}
      refreshControl={refreshControl}
      stickySectionHeadersEnabled={false}
      sections={sections}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      showsVerticalScrollIndicator={false}
      SectionSeparatorComponent={renderSectionSeparator}
      ItemSeparatorComponent={renderItemSeparator}
    />
  );
}

export default AccountInstrumentsView;
