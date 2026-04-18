import { StoryDto } from '@/hooks/queries/types/story';
import { SortOption } from './storage';

export const sortStories = (
  stories: StoryDto[],
  sortBy: SortOption,
): StoryDto[] => {
  return [...stories].sort((a, b) => {
    if (sortBy === 'score') {
      return b.score - a.score;
    } else {
      return b.time - a.time;
    }
  });
};
