import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Router, useRouter } from 'next/router';
import { api } from '../../services/api';
import { format , parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './episodes.module.scss';

interface Episode {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  description: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  url: string
};

interface EpisodeProps {
  episode: Episode
};

export default function Episode({ episode }: EpisodeProps) {
  const router = useRouter();
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
        <button type="button">
          <img src="/arrow-left.svg" alt="Go Back"/>
        </button>
        </Link>
        <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" objectPosition="center bottom"/>
        <button type="button">
          <img src="/play.svg" alt="Play"/>
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>
      <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}}>
      </div>
    </div>
  );
};

// 
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
};
// STATIC SITE GENERATION
export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data}  = await api.get(`episodes/${slug}`);
  const episode = {
      ...data,
      publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR}),
      duration: Number(data.file.duration),
      durationAsString: new Date(Number(data.file.duration) * 1000).toISOString().substr(11, 8),
      url: data.file.url
  };
  
  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24, //24 hours
  }
}