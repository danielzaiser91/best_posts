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
  icon_img: string,
  private: boolean
}
export interface RedditPost {
  by: string,
  is: string,
  uid: string,
  crosspost: boolean,
  subreddit: string,
  num_comments: number,
  thread_url: { thread: string, target: string },
  thumbnail: string | string[],
  src: RedditMedia,
  score: { onThis: number, onSource: number },
  spoiler: boolean,
  title: string,
  upvote_ratio: number,
  nsfw: boolean
}
export interface RedditComment {
  post_id: string,
  author: string,
  depth: number,
  text_md: string,
  created_utc: number,
  permalink: string,
  children: RedditComment[],
  score: number,
  stickied: boolean,
  subreddit: string,
  is_submitter: boolean,
  edited: boolean,
  collapsed: boolean
}
