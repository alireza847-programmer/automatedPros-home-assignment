import { StoriesList } from '@/components/storiesList';
import SortToggle from '@/components/sortToggle';
import AppSearchInput from '@/components/appSearchInput';
import OfflineBanner from '@/components/offlineBanner';
import { useTopStories } from '@/hooks/queries/useTopStories';
import { sortStorage, SortOption } from '@/utils/storage';
import { filterStories } from '@/utils/filtering';
import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

const HomeScreen = () => {
  const [sortBy, setSortBy] = useState<SortOption>('score');
  const [searchText, setSearchText] = useState('');

  const {
    topStories,
    isTopStoriesLoading,
    isTopStoriesRefetching,
    topStoriesError,
    refetchTopStories,
  } = useTopStories(sortBy);

  useLayoutEffect(() => {
    const loadSortPreference = async () => {
      const storedSort = await sortStorage.getSortPreference();
      setSortBy(storedSort);
    };

    loadSortPreference();
  }, []);

  useEffect(() => {
    sortStorage.setSortPreference(sortBy);
  }, [sortBy]);

  const filteredStories = useMemo(() => {
    if (!topStories) return [];
    return filterStories(topStories, searchText);
  }, [topStories, searchText]);

  const handleRefresh = () => {
    refetchTopStories();
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setSearchText('');
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <View style={styles.container}>
      <OfflineBanner isVisible={true} />
      <AppSearchInput
        value={searchText}
        onChangeText={handleSearchChange}
        placeholder="Search stories..."
      />
      <SortToggle sortBy={sortBy} onSortChange={handleSortChange} />
      <StoriesList
        items={filteredStories}
        isLoading={isTopStoriesLoading}
        isRefetching={isTopStoriesRefetching}
        error={topStoriesError}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
