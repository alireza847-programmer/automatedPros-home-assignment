import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { AppText } from '../appText';
import { colors, radius, spacing } from '@/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const AppSearchInput: FC<Props> = ({
  value,
  onChangeText,
  placeholder = 'Search stories...',
  debounceMs = 300,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChangeText(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, value, onChangeText, debounceMs]);

  const handleTextChange = useCallback((text: string) => {
    setLocalValue(text);
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={localValue}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {localValue.length > 0 && (
        <AppText style={styles.resultCount}>Searching: "{localValue}"</AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: spacing.md,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: 16,
  },
  resultCount: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default memo(AppSearchInput);
