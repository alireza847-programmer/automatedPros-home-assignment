import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppText } from '../appText';
import { colors, radius, spacing } from '@/theme';

export type SelectItem<T extends string> = {
  name: string;
  value: T;
};

type Props<T extends string> = {
  title: string;
  items: readonly SelectItem<T>[];
  onItemChange: (value: T) => void;
  selectedValue?: T;
  testId?: string;
};

export function AppSelectBox<T extends string>({
  title,
  items,
  onItemChange,
  selectedValue,
  testId,
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(open => !open);
  };

  const handleSelect = (value: T) => {
    onItemChange(value);
    closeModal();
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        testID={testId}
        onPress={handleOpen}
        activeOpacity={0.8}
        style={styles.container}
      >
        <AppText style={styles.title}>
          {selectedValue === 'ALL' ? title : selectedValue}{' '}
          <AppText variant="small">{isOpen ? '▲' : '▼'}</AppText>
        </AppText>
      </TouchableOpacity>
      <Modal visible={isOpen} transparent>
        <TouchableOpacity onPress={closeModal} style={styles.modalContainer}>
          <View style={styles.modalView}>
            <ScrollView>
              {items.map(item => {
                return (
                  <TouchableOpacity
                    onPress={() => handleSelect(item.value)}
                    style={StyleSheet.flatten([
                      styles.item,
                      selectedValue === item.value && styles.selectedItem,
                    ])}
                    key={item.value}
                    activeOpacity={0.8}
                  >
                    <AppText>{item.name}</AppText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    justifyContent: 'center',
  },
  title: {
    padding: spacing.sm,
    textTransform: 'lowercase',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: colors.card,
    width: '90%',
    maxHeight: '80%',
    borderRadius: radius.sm,
  },
  item: {
    padding: spacing.lg,
  },
  selectedItem: {
    backgroundColor: colors.accent,
  },
});
