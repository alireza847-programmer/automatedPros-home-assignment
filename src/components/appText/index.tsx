import { colors, typography } from '@/theme';
import { FC, PropsWithChildren } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface Props {
  variant?: keyof typeof typography;
  numberOfLines?: number;
  style?: TextStyle | TextStyle[];
}

export const AppText: FC<PropsWithChildren<Props>> = ({
  children,
  variant = 'subtitle',
  numberOfLines,
  style,
}) => {
  const styles = useStyles(variant);
  return (
    <Text
      style={StyleSheet.flatten([styles.text, style])}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

const useStyles = (
  variant: React.ComponentProps<typeof AppText>['variant'],
) => {
  return StyleSheet.create({
    text: {
      fontSize: typography[variant!],
      color: colors.textPrimary,
    },
  });
};

export default useStyles;
