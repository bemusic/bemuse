export interface MusicServerData {
    songs:               Song[];
}

export interface Song {
    title:               string;
    artist:              string;
    genre:               string;
    bpm:                 number;
    artist_url:          string;
    bms_url?:            string;
    song_url?:           string;
    youtube_url?:        string;
    added?:              Date;
    replaygain:          string;
    video_url?:          string;
    video_offset?:       number | string;
    bmssearch_id?:       number | string;
    readme:              'README.md';
    charts:              Chart[];
    warnings?:           any[];
    id:                  string;
    path:                string;
    alias_of?:           string;
    chart_names?:        Record<string, string | undefined>;
    long_url?:           string;
    initial?:            boolean;
    preview_start?:      number;
    video_file?:         File;
    tutorial?:           number;
    exclusive?:          boolean;
    bemusepack_url?:     string;
    preview_offset?:     number;
    preview_url?:        string;
    back_image_url?:     string;
    eyecatch_image_url?: string;
}

export interface Chart {
    md5:       string;
    info:      Info;
    noteCount: number;
    bpm:       BPM;
    duration:  number;
    scratch:   boolean;
    keys:      Keys;
    file:      string;
    bga?:      Bga;
}

export interface Bga {
    file:   File;
    offset: number;
}

export enum File {
    BgaMp4 = "bga.mp4",
    The28BGAMp4 = "28-BGA.mp4",
}

export interface BPM {
    init:   number;
    min:    number;
    median: number;
    max:    number;
}

export interface Info {
    title:      string;
    artist:     string;
    genre:      string;
    subtitles:  string[];
    subartists: string[];
    difficulty: number;
    level:      number;
}

export enum Keys {
    Empty = "empty",
    The14K = "14K",
    The5K = "5K",
    The7K = "7K",
}

export interface URL {
    url:    string;
    added?: Date;
}
