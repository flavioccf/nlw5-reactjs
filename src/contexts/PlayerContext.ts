import { createContext } from 'react';

interface Episode {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  url: string
};

interface PlayerContextData {
  episodeList: Episode[],
  currentEpisodeIndex: number,
  play: (episode: Episode) => void,
  togglePlay: () => void,
  isPlaying: boolean,
  setPlayingState: (state: boolean) => void
}

export const PlayerContext = createContext({} as PlayerContextData);