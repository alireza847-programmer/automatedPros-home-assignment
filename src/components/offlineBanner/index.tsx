import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { AppText } from '../appText';
import { colors, spacing } from '@/theme';

interface Props {
  isVisible: boolean;
}

const OfflineBanner: FC<Props> = ({ isVisible }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return unsubscribe;
  }, []);

  if (isVisible && !isConnected) {
    return (
      <View style={styles.container}>
        <AppText style={styles.text}>
          🔴 You're offline. Some features may not work.
        </AppText>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.red,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default OfflineBanner;
