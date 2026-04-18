export enum Screens {
  home = 'home',
  bookmarks = 'bookmarks',
}

export type RootStackParamList = {
  [Screens.home]: undefined;
  [Screens.bookmarks]: undefined;
};
