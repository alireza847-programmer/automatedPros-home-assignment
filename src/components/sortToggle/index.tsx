import React, { FC, memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../appText';
import { colors, radius, spacing } from '@/theme';
import { SortOption } from '@/utils/storage';

interface Props {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortToggle: FC<Props> = ({ sortBy, onSortChange }) => {
  const handleSortChange = (newSort: SortOption) => {
    onSortChange(newSort);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={StyleSheet.flatten([
          styles.option,
          sortBy === 'score' && styles.selectedOption,
        ])}
        onPress={() => handleSortChange('score')}
      >
        <AppText
          style={StyleSheet.flatten([
            styles.optionText,
            sortBy === 'score' && styles.selectedText,
          ])}
        >
          Score
        </AppText>
      </Pressable>

      <Pressable
        style={StyleSheet.flatten([
          styles.option,
          sortBy === 'time' && styles.selectedOption,
        ])}
        onPress={() => handleSortChange('time')}
      >
        <AppText
          style={StyleSheet.flatten([
            styles.optionText,
            sortBy === 'time' && styles.selectedText,
          ])}
        >
          Time
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.xs,
    margin: spacing.md,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: colors.card,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  selectedText: {
    color: colors.accent,
    fontWeight: '600',
  },
});

export default memo(SortToggle);
