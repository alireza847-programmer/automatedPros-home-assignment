import { StoryDto } from '@/hooks/queries/types/story';

export const filterStories = (
  stories: StoryDto[],
  searchText: string,
): StoryDto[] => {
  if (!searchText.trim()) {
    return stories;
  }

  const searchLower = searchText.toLowerCase().trim();

  return stories.filter(story =>
    story.title.toLowerCase().includes(searchLower),
  );
};
