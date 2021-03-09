export type RedditImage = string;
export type RedditGallery = string[];
export type RedditVideo = {
  vid: string,
  aud: string
};
export type RedditYoutube = string;
export type RedditMedia = RedditVideo | RedditImage | RedditGallery | RedditYoutube;
export type RedditSort = 'top'|'hot'|'new'|'rising';
export interface Subreddit {
  identifier: string,
  name: string,
  subscribers: number,
  created_utc: number,
  over18: boolean,
  description: string,
  community_icon: string,
  icon_img: string
}
export interface RedditPost {
  by: string,
  is: string,
  num_comments: number,
  thread_url: { thread: string, target: string },
  thumbnail: string | string[],
  src: RedditMedia,
  score: number
  spoiler: boolean,
  title: string,
  upvote_ratio: number,
  nsfw: boolean
}

export interface SubredditTable extends Partial<Subreddit> {
  id?: number
}
