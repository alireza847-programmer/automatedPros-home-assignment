import { colors, typography } from '@/theme';
import { FC, PropsWithChildren } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface Props {
  variant?: keyof typeof typography;
  style?: TextStyle | TextStyle[];
}

export const AppText: FC<PropsWithChildren<Props>> = ({
  children,
  variant = 'subtitle',
  style,
}) => {
  const styles = useStyles(variant);
  return (
    <Text style={StyleSheet.flatten([styles.text, style])}>{children}</Text>
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
