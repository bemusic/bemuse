export interface MusicServerData {
  songs: Song[];
}

export interface Song {
  title: string;
  artist: string;
  artist_url: string;
  bms_url?: string;
  song_url?: string;
  alias_of?: string;
  long_url?: string;
}
