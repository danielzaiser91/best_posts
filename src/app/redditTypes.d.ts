type RedditImage = {
  [Property in 'img']: string
}
type RedditVideo = {
  [Property in 'vid'|'aud']: string
}
export type RedditMedia = RedditVideo | RedditImage;
export type RedditSort = 'top'|'hot'|'new'|'rising';
