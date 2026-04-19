import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { AppText } from '@/components/appText';
import React from 'react';

export function Row(props: {
  label: string;
  value?: string | React.ReactElement;
}) {
  return (
    <View style={styles.row}>
      <AppText style={styles.label}>{props.label}</AppText>
      <AppText style={styles.value}>{props.value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  label: { color: colors.textSecondary },
  value: { color: colors.textPrimary },
});
