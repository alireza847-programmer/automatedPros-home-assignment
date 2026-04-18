import React, { FC } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppText } from '@/components/appText';
import { colors, spacing, radius } from '@/theme';
import useBookmarksStore from '@/store/bookmarksStore';
import { StoryDto } from '@/hooks/queries/types/story';

interface Props {
  story: StoryDto;
}

const AddBookmark: FC<Props> = ({ story }) => {
  const isBookmarked = useBookmarksStore(state =>
    state.isStoryBookmarked(story.id),
  );
  const toggleBookmark = useBookmarksStore(state => state.toggleBookmark);

  return (
    <View style={styles.container}>
      <View style={styles.bookmarkRow}>
        <AppText style={styles.metaLabel}>Bookmark:</AppText>
        <Pressable
          onPress={() => toggleBookmark(story.id)}
          style={[
            styles.bookmarkButton,
            isBookmarked && styles.bookmarkButtonActive,
          ]}
        >
          <AppText
            style={
              isBookmarked
                ? [styles.bookmarkText, styles.bookmarkTextActive]
                : styles.bookmarkText
            }
          >
            {isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 32,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  metaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: spacing.sm,
    minWidth: 60,
  },
  metaValue: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  url: {
    fontSize: 16,
    color: colors.accent,
    textDecorationLine: 'underline',
  },
  bookmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  bookmarkButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.border,
    borderRadius: radius.sm,
  },
  bookmarkButtonActive: {
    backgroundColor: colors.accent,
  },
  bookmarkText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  bookmarkTextActive: {
    color: colors.card,
  },
});

export default AddBookmark;
