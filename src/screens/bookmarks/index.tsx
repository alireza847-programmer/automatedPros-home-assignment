import { StoriesList } from '@/components/storiesList';
import { QUERY_KEYS } from '@/hooks/queries/keys';
import { StoryDto } from '@/hooks/queries/types/story';
import useBookmarksStore from '@/store/bookmarksStore';
import { useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

const BookmarksScreen = () => {
  const queryClient = useQueryClient();
  const topStories: StoryDto[] | undefined = queryClient.getQueryData([
    QUERY_KEYS.topStories,
  ]);
  const bookmarkedStories = useBookmarksStore(
    state => state.bookmarkedStoryIds,
  );

  const bookmarkedTopStories = useMemo(() => {
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
