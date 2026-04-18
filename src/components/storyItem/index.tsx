import React, { FC, memo, useCallback, useRef, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { AppText } from '../appText';
import AppImage from '../appImage';
import { colors, radius, spacing } from '@/theme';
import { testIds } from '@/consts/testIds';
import { StoryDto } from '@/hooks/queries/types/story';
import { getRelativeTime } from '@/utils/time';
import { getDomainFromUrl } from '@/utils/url';
import { RootStackParamList, Screens } from '@/navigation/types';
import useBookmarksStore from '@/store/bookmarksStore';

interface Props {
  item: StoryDto;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RightDeleteAction: FC<{ onDelete: () => void }> = ({ onDelete }) => {
  return (
    <View style={[styles.deleteContainer]}>
      <Pressable onPress={onDelete} style={styles.deleteButton}>
        <AppText style={styles.deleteLabel}>Remove</AppText>
      </Pressable>
    </View>
  );
};

const StoryItem: FC<Props> = ({ item }) => {
  const navigation = useNavigation<NavigationProp>();
  const swipeableRef = useRef<SwipeableMethods>(null);
  const isStoryBookmarked = useBookmarksStore(state =>
    state.isStoryBookmarked(item.id),
  );
  const toggleBookmark = useBookmarksStore(state => state.toggleBookmark);

  const sourceDomain = useMemo(() => getDomainFromUrl(item.url), [item.url]);

  const faviconUrl = useMemo(
    () =>
      sourceDomain
        ? `https://www.google.com/s2/favicons?domain=${sourceDomain}&sz=64`
        : null,
    [sourceDomain],
  );

  const relativeTime = useMemo(() => getRelativeTime(item.time), [item.time]);

  const onItemPress = useCallback(() => {
    navigation.navigate(Screens.storyDetails, { story: item });
  }, [navigation, item]);

  const renderRightActions = useCallback(
    () => <RightDeleteAction onDelete={() => toggleBookmark(item.id)} />,
    [item.id, toggleBookmark],
  );

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      renderRightActions={renderRightActions}
      overshootRight={false}
      containerStyle={styles.swipeableContainer}
      enabled={isStoryBookmarked}
    >
      <Pressable
        onPress={onItemPress}
        testID={testIds.list.item(item.id)}
        style={styles.container}
      >
        {faviconUrl && (
          <AppImage
            uri={faviconUrl}
            size={32}
            style={styles.favicon}
            resizeMode={FastImage.resizeMode.contain}
          />
        )}
        <View style={styles.content}>
          <AppText style={styles.title} numberOfLines={2}>
            {item.title}
          </AppText>

          <View style={styles.metadata}>
            {sourceDomain && (
              <AppText style={styles.domain}>{sourceDomain}</AppText>
            )}
            <AppText style={styles.score}>{item.score} points</AppText>
            <AppText style={styles.time}>{relativeTime}</AppText>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

export default memo(StoryItem);

const styles = StyleSheet.create({
  swipeableContainer: {
    marginVertical: spacing.xs,
  },
  container: {
    height: 85,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favicon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    marginRight: spacing.md,
    backgroundColor: colors.border,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  domain: {
    fontSize: 14,
    color: colors.accent,
    marginRight: spacing.md,
  },
  score: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
  time: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  deleteContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: radius.md,
    marginLeft: spacing.xs,
  },
  deleteButton: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  deleteLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
