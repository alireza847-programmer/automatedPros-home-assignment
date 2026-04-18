import { StoryDto } from '@/hooks/queries/types/story';

export enum Screens {
  home = 'home',
  storyDetails = 'storyDetails',
  bookmarks = 'Bookmarks',
}

export type RootStackParamList = {
  [Screens.home]: undefined;
  [Screens.storyDetails]: { story: StoryDto };
  [Screens.bookmarks]: undefined;
};
