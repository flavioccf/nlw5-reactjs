import { tr } from 'date-fns/locale';
import { createContext, ReactNode, useContext, useState } from 'react';

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
  playList: (list: Episode[], index: number) => void,
  togglePlay: () => void,
  playNext: () => void,
  playPrevious: () => void,
  isPlaying: boolean,
  isLooping: boolean,
  toggleLoop: () => void,
  isShuffling: boolean,
  toggleShuffle: () => void,
  hasNext: boolean,
  hasPrevious: boolean,
  setPlayingState: (state: boolean) => void,
  clearPlayerState: () => void
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode
}

export default function PlayerContextProvider ({children}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  const play = (episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  }

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  }

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  }

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  }

  const clearPlayerState = () => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasNext = (currentEpisodeIndex + 1 < episodeList.length);
  const hasPrevious = (currentEpisodeIndex - 1 >= 0);

  const playNext = () => {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if(hasNext) {
      const nexEpisodeIndex = currentEpisodeIndex + 1;
      setCurrentEpisodeIndex(nexEpisodeIndex);
    } 
  }

  const playPrevious = () => {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if(hasPrevious) {
      const previousEpisodeIndex = currentEpisodeIndex - 1;
      setCurrentEpisodeIndex(previousEpisodeIndex);
    } 
  }

  return(
  <PlayerContext.Provider value={{ 
      playList,
      episodeList, 
      currentEpisodeIndex,
      play, 
      isPlaying, 
      togglePlay,
      isLooping,
      toggleLoop,
      isShuffling,
      toggleShuffle, 
      playNext,
      playPrevious,
      setPlayingState,
      hasNext,
      hasPrevious,
      clearPlayerState
    }}>
    {children}
  </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  return useContext(PlayerContext);
}