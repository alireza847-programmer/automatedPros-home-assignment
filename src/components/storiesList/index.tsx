import { FC, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AssetItem from '../storyItem';
import { spacing, colors } from '@/theme';
import { AppText } from '../appText';
import { testIds } from '@/consts/testIds';
import { StoryDto } from '@/hooks/queries/types/story';
import useScrollPositionStore from '@/store/scrollPositionStore';

interface Props {
  items: StoryDto[];
  isLoading?: boolean;
  isRefetching?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}

const ITEM_HEIGHT = 85;
const ITEM_SPACING = spacing.md;
const ROW_SIZE = ITEM_HEIGHT + ITEM_SPACING;

export const StoriesList: FC<Props> = ({
  items,
  isLoading = false,
  isRefetching = false,
  error,
  onRefresh,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollPosition = useScrollPositionStore(state => state.scrollPosition);
  const setScrollPosition = useScrollPositionStore(
    state => state.setScrollPosition,
  );

  useFocusEffect(
    useCallback(() => {
      if (flatListRef.current && scrollPosition > 0) {
        const timeoutId = setTimeout(() => {
          flatListRef.current?.scrollToOffset({
            offset: scrollPosition,
            animated: false,
          });
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }, [scrollPosition]),
  );
  const handleScroll = useCallback(
    (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      setScrollPosition(offsetY);
    },
    [setScrollPosition],
  );

  const keyExtractor = useCallback((item: StoryDto) => item.id?.toString(), []);

  const renderItem = useCallback(({ item }: { item: StoryDto }) => {
    return <AssetItem item={item} />;
  }, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ROW_SIZE,
      offset: ROW_SIZE * index,
      index,
    }),
    [],
  );

  const listEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <AppText style={styles.loadingText}>Loading stories...</AppText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <AppText style={styles.errorTitle}>
            Oops! Something went wrong
          </AppText>
          <AppText style={styles.errorMessage}>
            {error.message || 'Failed to load stories. Please try again.'}
          </AppText>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <AppText style={styles.emptyTitle}>No stories found</AppText>
        <AppText style={styles.emptyMessage}>
          There are no stories available at the moment.
        </AppText>
      </View>
    );
  }, [isLoading, error]);

  const itemSeparator = useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  const refreshControl = useMemo(() => {
    if (onRefresh) {
      return (
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
          colors={[colors.accent]}
          tintColor={colors.accent}
        />
      );
    }
    return undefined;
  }, [isRefetching, onRefresh]);

  return (
    <FlatList
      ref={flatListRef}
      data={items}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.containerStyle}
      ListEmptyComponent={listEmptyComponent}
      ItemSeparatorComponent={itemSeparator}
      refreshControl={refreshControl}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    />
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: spacing.lg,
    paddingBottom: ITEM_SPACING + 20,
    flexGrow: 1,
  },
  separator: {
    height: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.red,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
