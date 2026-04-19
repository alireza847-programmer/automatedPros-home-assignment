import { StoriesList } from '@/components/storiesList';
import { useTopStories } from '@/hooks/queries/useTopStories';
import useBookmarksStore from '@/store/bookmarksStore';
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

const BookmarksScreen = () => {
  const { topStories } = useTopStories();
  const bookmarkedStories = useBookmarksStore(
    state => state.bookmarkedStoryIds,
  );

  const bookmarkedTopStories = useMemo(() => {
    console.log({ topStories });
    if (!topStories) return [];

    return topStories.filter(story => bookmarkedStories.includes(story.id));
  }, [topStories, bookmarkedStories]);

  return (
    <View style={styles.container}>
      <StoriesList items={bookmarkedTopStories} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BookmarksScreen;
