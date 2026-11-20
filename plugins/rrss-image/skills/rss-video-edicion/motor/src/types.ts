// Shape of edicion/timeline.json. All times are in seconds on the output
// timeline unless the field name says otherwise; paths are relative to the
// video folder, which is passed to Remotion as --public-dir.

export type Zoom = {
  // Scale at the start and end of the clip; 1 = original framing.
  from: number;
  to: number;
  // Point that stays fixed while scaling, as fractions of width and height.
  focusX?: number;
  focusY?: number;
  ease?: 'linear' | 'inOut';
};

export type Clip = {
  src: string;
  start: number;
  duration: number;
  // Source position where the clip starts, in source seconds.
  in?: number;
  speed?: number;
  // Lower tracks draw first; B-roll and overlays use higher tracks.
  track?: number;
  kind?: 'video' | 'image';
  // Volume of the clip's own sound; 0 mutes it.
  volume?: number;
  // The clip's own sound is speech: music ducks under it.
  speech?: boolean;
  zoom?: Zoom;
  // Short opacity fade at the edges, in seconds. Default: hard cut.
  fadeIn?: number;
  fadeOut?: number;
};

export type TextStyle = 'gancho' | 'clave' | 'cta';

export type TextItem = {
  text: string;
  start: number;
  end: number;
  style?: TextStyle;
  // Vertical center of the text block as a fraction of the height.
  y?: number;
  animation?: 'pop' | 'none';
};

export type CaptionWord = {
  text: string;
  start: number;
  end: number;
};

export type Captions = {
  words: CaptionWord[];
  maxWords?: number;
  y?: number;
  // Intervals [start, end] in seconds where captions are hidden, e.g. while a
  // card already shows the spoken words.
  hide?: [number, number][];
  // The engine draws plain captions unless this is false, which is set when
  // an effect draws them instead.
  plain?: boolean;
  // Hide captions while these intervals have on-screen text.
  hideDuringTexts?: boolean;
};

export type AudioItem = {
  src: string;
  start: number;
  in?: number;
  duration?: number;
  role: 'voz' | 'musica' | 'sfx' | 'ambiente';
  // Linear gain; 1 = file level.
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
};

export type Brand = {
  fontFamily?: string;
  // Font file relative to the video folder, e.g. "fuentes/marca.ttf".
  fontFile?: string;
  captionFontFamily?: string;
  captionFontFile?: string;
  textColor?: string;
  accentColor?: string;
  boxColor?: string;
  // Outline of the captions.
  strokeColor?: string;
};

export type Ducking = {
  // Music gain without speech and under speech.
  base?: number;
  underSpeech?: number;
  rampSeconds?: number;
};

// One use of a brand effect script, by the name it has in the brand's
// efectos/INDICE.md. `params` carries what is specific to this video.
export type EffectItem = {
  name: string;
  start: number;
  end: number;
  params?: Record<string, unknown>;
};

export type Timeline = {
  fps?: number;
  width?: number;
  height?: number;
  // Total length; defaults to the end of the last clip.
  duration?: number;
  background?: string;
  brand?: Brand;
  clips: Clip[];
  texts?: TextItem[];
  captions?: Captions;
  audio?: AudioItem[];
  ducking?: Ducking;
  effects?: EffectItem[];
};
