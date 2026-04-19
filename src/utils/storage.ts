import AsyncStorage from '@react-native-async-storage/async-storage';

export type SortOption = 'score' | 'time';

const SORT_KEY = '@sort_preference';

export const sortStorage = {
  async getSortPreference(): Promise<SortOption> {
    try {
      const value = await AsyncStorage.getItem(SORT_KEY);
      return (value as SortOption) || 'score';
    } catch {
      return 'score';
    }
  },

  async setSortPreference(sort: SortOption): Promise<void> {
    await AsyncStorage.setItem(SORT_KEY, sort);
  },
};
