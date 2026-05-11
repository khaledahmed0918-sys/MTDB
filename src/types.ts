export interface Character {
  id: string;
  characterName: string;
  playerName: string;
  avatarUrl: string;
  isMystery: boolean;
}

export interface Episode {
  id: string;
  title: string;
  posterUrl: string;
  videoLink: string;
  rating: number;
  votes: number;
  synopsis: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  mainPosterUrl: string;
  overallRating: number;
  totalVotes: number;
  tags?: string[];
  episodes: Episode[];
  cast: Character[];
  trailerUrl?: string;
}

export interface Edit {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  creator?: string;
  category?: string;
  projectUrl?: string;
}
