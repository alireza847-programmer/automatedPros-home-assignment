jest.mock('@react-native-async-storage/async-storage');

import { act } from 'react-test-renderer';
import useBookmarksStore from '../src/store/bookmarksStore';

describe('bookmarksStore', () => {
  beforeEach(() => {
    useBookmarksStore.setState({ bookmarkedStoryIds: [] });
  });

  it('toggles bookmark ids on and off', () => {
    act(() => {
      useBookmarksStore.getState().toggleBookmark(42);
    });

    expect(useBookmarksStore.getState().bookmarkedStoryIds).toEqual([42]);
    expect(useBookmarksStore.getState().isStoryBookmarked(42)).toBe(true);

    act(() => {
      useBookmarksStore.getState().toggleBookmark(42);
    });

    expect(useBookmarksStore.getState().bookmarkedStoryIds).toEqual([]);
    expect(useBookmarksStore.getState().isStoryBookmarked(42)).toBe(false);
  });

  it('toggles bookmark state correctly across multiple presses', () => {
    act(() => {
      useBookmarksStore.getState().toggleBookmark(13);
      useBookmarksStore.getState().toggleBookmark(13);
      useBookmarksStore.getState().toggleBookmark(13);
    });

    expect(useBookmarksStore.getState().bookmarkedStoryIds).toEqual([13]);
    expect(useBookmarksStore.getState().isStoryBookmarked(13)).toBe(true);
  });
});
