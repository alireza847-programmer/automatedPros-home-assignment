import { StoriesList } from '@/components/storiesList';
import { useTopStories } from '@/hooks/queries/useTopStories';
import useBookmarksStore from '@/store/bookmarksStore';
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

const BookmarksScreen = () => {
  const {
    topStories,
    isTopStoriesLoading,
    isTopStoriesRefetching,
    topStoriesError,
  } = useTopStories();
  const bookmarkedStories = useBookmarksStore(
    state => state.bookmarkedStoryIds,
  );

  const bookmarkedTopStories = useMemo(() => {
    if (!topStories) return [];
    return topStories.filter(story => bookmarkedStories.includes(story.id));
  }, [topStories, bookmarkedStories]);

  return (
    <View style={styles.container}>
      <StoriesList
        items={bookmarkedTopStories}
        isLoading={isTopStoriesLoading}
        isRefetching={isTopStoriesRefetching}
        error={topStoriesError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BookmarksScreen;
