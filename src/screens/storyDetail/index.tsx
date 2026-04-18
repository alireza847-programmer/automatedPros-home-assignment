import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking, Pressable } from 'react-native';
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { RootStackParamList, Screens } from '@/navigation/types';
import { AppText } from '@/components/appText';
import { colors, spacing, radius } from '@/theme';
import { getRelativeTime } from '@/utils/time';
import ShareButton from '@/components/shareButton';
import AddBookmark from '@/components/addBookmark';

type StoryDetailRouteProp = RouteProp<RootStackParamList, Screens.storyDetails>;

type StoryDetailNavigationProp = NavigationProp<RootStackParamList>;

const StoryDetailScreen = () => {
  const route = useRoute<StoryDetailRouteProp>();
  const navigation = useNavigation<StoryDetailNavigationProp>();
  const { story } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ShareButton story={story} />,
    });
  }, [navigation, story]);

  const relativeTime = getRelativeTime(story.time);

  const handleUrlPress = () => {
    if (story.url) {
      Linking.openURL(story.url);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AppText style={styles.title}>{story.title}</AppText>
      </View>

      <View style={styles.metadata}>
        <AppText style={styles.metaLabel}>Author:</AppText>
        <AppText style={styles.metaValue}>{story.by}</AppText>
      </View>

      <View style={styles.metadata}>
        <AppText style={styles.metaLabel}>Score:</AppText>
        <AppText style={styles.metaValue}>{story.score} points</AppText>
      </View>

      <View style={styles.metadata}>
        <AppText style={styles.metaLabel}>Time:</AppText>
        <AppText style={styles.metaValue}>{relativeTime}</AppText>
      </View>

      {story.url && (
        <View style={styles.metadata}>
          <AppText style={styles.metaLabel}>URL:</AppText>
          <Pressable onPress={handleUrlPress}>
            <AppText style={styles.url}>{story.url}</AppText>
          </Pressable>
        </View>
      )}

      <AddBookmark story={story} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
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

export default StoryDetailScreen;
