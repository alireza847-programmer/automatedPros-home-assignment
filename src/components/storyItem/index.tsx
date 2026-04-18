import React, { FC, memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText } from '../appText';
import AppImage from '../appImage';
import { colors, radius, spacing } from '@/theme';
import { testIds } from '@/consts/testIds';
import { StoryDto } from '@/hooks/queries/types/story';
import { getRelativeTime } from '@/utils/time';
import { getDomainFromUrl } from '@/utils/url';
import { RootStackParamList, Screens } from '@/navigation/types';

interface Props {
  item: StoryDto;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StoryItem: FC<Props> = ({ item }) => {
  const navigation = useNavigation<NavigationProp>();
  const sourceDomain = useMemo(() => {
    return getDomainFromUrl(item.url);
  }, [item.url]);

  const faviconUrl = useMemo(() => {
    return sourceDomain
      ? `https://www.google.com/s2/favicons?domain=${sourceDomain}&sz=64`
      : null;
  }, [sourceDomain]);
  console.log({ faviconUrl });

  const relativeTime = useMemo(() => {
    return getRelativeTime(item.time);
  }, [item.time]);

  const onItemPress = useCallback(() => {
    navigation.navigate(Screens.storyDetails, { story: item });
  }, [navigation, item]);

  return (
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
        <AppText style={styles.title}>{item.title}</AppText>

        <View style={styles.metadata}>
          {sourceDomain && (
            <AppText style={styles.domain}>{sourceDomain}</AppText>
          )}
          <AppText style={styles.score}>{item.score} points</AppText>
          <AppText style={styles.time}>{relativeTime}</AppText>
        </View>
      </View>
    </Pressable>
  );
};

export default memo(StoryItem);

const styles = StyleSheet.create({
  container: {
    minHeight: 80,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'flex-start',
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
});
