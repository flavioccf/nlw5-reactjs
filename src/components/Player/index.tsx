import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export function Player() {
  const durationToTime = (duration: number | undefined) => {
      return new Date(Number(duration ?? 0) * 1000).toISOString().substr(11, 8)
  }
  const setupProgressListener = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(audioRef.current.currentTime);
    })
  };

  const handleSeek = (amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  const handleEpisodeEnded = () => {
    console.log('ended');
    setProgress(0);
    if(hasNext || isShuffling) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  const [progress, setProgress] = useState(0);
  // GETS THE REFERENCE FROM HTML ELEMENTS or OTHERS
  const audioRef = useRef<HTMLAudioElement>();
  const { 
    setPlayingState, 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    clearPlayerState
  } = usePlayer();
  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if(!audioRef.current) return;
    if(isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  },[isPlaying]);

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
      <div className={styles.currentEpisode}>
        <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" objectPosition="center center"/>
        <strong>{ episode.title }</strong>
        <span>{ episode.members }</span>
      </div>
      ) : (
      <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
      )}
 

      <footer className={episode ? '' : styles.empty}>
        <div className={styles.progress}>
          <span>{ durationToTime(progress) }</span>
          <div className={styles.slider}>
            {
              episode ? (
                <Slider
                  max={episode.duration}
                  value={progress}
                  onChange={handleSeek}
                  trackStyle={{backgroundColor: '#04D361'}}
                  railStyle={{backgroundColor: '#9f75ff'}}
                  handleStyle={{borderColor: '#04D361', borderWidth:4}}
                ></Slider>
              ) : (
                <div className={styles.emptySlider}/>
              )
            }
          </div>
          <span>{ durationToTime(episode?.duration) }</span>
        </div>

        { episode && (
          <audio 
            autoPlay
            src={ episode.url} 
            ref={audioRef} 
            loop={isLooping}
            onPlay={() => setPlayingState(true)} 
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode || episodeList.length <= 1} 
          onClick={toggleShuffle} className={isShuffling ? styles.isActive : ''}>
            <img src="/shuffle.svg" alt="Shuffle" />
          </button>
          <button type="button" disabled={!episode || (!hasPrevious  && !isShuffling)} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Previous" />
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            { !isPlaying ? 
            <img src="/play.svg" alt="Play" /> :
            <img src="/pause.svg" alt="Pause" />}
          </button>
          <button type="button" disabled={!episode || (!hasNext && !isShuffling)} onClick={playNext}>
            <img src="/play-next.svg" alt="Next" />
          </button>
          <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ''}>
            <img src="/repeat.svg" alt="Repeat" />
          </button>
        </div>
      </footer>
    </div>
  )
}