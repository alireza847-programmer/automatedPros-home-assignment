import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type BookmarkState = {
  bookmarkedStoryIds: number[];
  toggleBookmark: (id: number) => void;
  isStoryBookmarked: (id: number) => boolean;
};

const useBookmarksStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarkedStoryIds: [],
      toggleBookmark: (id: number) => {
        const currentIds = get().bookmarkedStoryIds;
        const nextIds = currentIds.includes(id)
          ? currentIds.filter(storyId => storyId !== id)
          : [...currentIds, id];

        set({ bookmarkedStoryIds: Array.from(new Set(nextIds)) });
      },
      isStoryBookmarked: (id: number) => get().bookmarkedStoryIds.includes(id),
    }),
    {
      name: 'bookmarks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useBookmarksStore;
