import { StoryDto } from '@/hooks/queries/types/story';

export enum Screens {
  home = 'home',
  storyDetails = 'storyDetails',
}

export type RootStackParamList = {
  [Screens.home]: undefined;
  [Screens.storyDetails]: { story: StoryDto };
};
