jest.mock('@react-native-async-storage/async-storage');

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import AddBookmark from '../src/components/addBookmark';
import useBookmarksStore from '../src/store/bookmarksStore';
import { testIds } from '@/consts/testIds';

const story = {
  id: 123,
  title: 'Test Story',
  by: 'test-user',
  score: 10,
  time: 1610000000,
  url: 'https://example.com',
  text: 'Test story text',
  descendants: 0,
  kids: [],
  type: 'story',
};

describe('AddBookmark component', () => {
  beforeEach(() => {
    act(() => {
      useBookmarksStore.setState({ bookmarkedStoryIds: [] });
    });
  });

  it('toggles bookmark state when the button is pressed', () => {
    render(<AddBookmark story={story} />);
    const button = screen.getByTestId(testIds.bookmark.button(story.id));
    expect(button).toHaveTextContent('Add Bookmark');

    fireEvent.press(button);

    expect(button).toHaveTextContent('Bookmarked');
  });
});
