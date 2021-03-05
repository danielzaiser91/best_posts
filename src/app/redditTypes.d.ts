type RedditImage = {
  [Property in 'img']: string
}
type RedditGallery = [{
  [Property in 'u']: string
}]
type RedditVideo = {
  [Property in 'vid'|'aud']: string
}
export type RedditMedia = RedditVideo | RedditImage | RedditGallery;
export type RedditSort = 'top'|'hot'|'new'|'rising';
