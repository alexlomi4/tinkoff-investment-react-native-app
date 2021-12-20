import React, {useCallback, useState} from 'react';
import Carousel, {CarouselProperties} from 'react-native-snap-carousel';
import {ListRenderItem, View, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  activeLine: {
    backgroundColor: '#4C5E8B4C',
  },
  line: {
    backgroundColor: '#000',
    height: 3,
  },
  lineContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 20,
  },
});

type Props<T> = CarouselProperties<T>;

function CustomCarousel<T>({
  data,
  renderItem,
  sliderWidth,
  itemWidth,
  onSnapToItem,
  bounces,
}: Props<T>) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const onSnapToItemCallback = useCallback(
    (index: number) => {
      setCurrentIdx(index);
      if (onSnapToItem) {
        onSnapToItem(index);
      }
    },
    [onSnapToItem],
  );

  const lineWidth = (sliderWidth ?? 0) / data.length;

  const renderPagination = useCallback<ListRenderItem<T>>(
    () => (
      <View style={styles.lineContainer}>
        {[...new Array(data.length)].map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.line,
              {width: lineWidth},
              idx === currentIdx && styles.activeLine,
            ]}
          />
        ))}
      </View>
    ),
    [currentIdx, data.length, lineWidth],
  );

  const renderItemWithPagination = useCallback<ListRenderItem<T>>(
    params => (
      <>
        {renderPagination(params)}
        {renderItem(params)}
      </>
    ),
    [renderItem, renderPagination],
  );

  return (
    <Carousel
      data={data}
      renderItem={renderItemWithPagination}
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
      swipeThreshold={lineWidth / 2}
      activeSlideOffset={lineWidth}
      onSnapToItem={onSnapToItemCallback}
      bounces={bounces}
    />
  );
}

export default CustomCarousel;
