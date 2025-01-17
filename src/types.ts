export interface CreateSharePreviewOptions {
  worldName: string;
  imageUrl: string;
  playerNameList: string[];
  isDarkMode: boolean;
  showAllPlayers?: boolean;
}

export const PLAYER_COUNT_SUFFIX = ' more' as const;
