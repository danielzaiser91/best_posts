import { RedditComment, RedditGallery, RedditMedia, RedditPost, Subreddit } from "../../app/types";

const formatMedia = (v: any, is: string): RedditMedia => {
  if (is === 'video') {
    const redGif = (v.preview && ('reddit_video_preview' in v.preview)),
      vid = redGif ? v.preview.reddit_video_preview.fallback_url : v.media.reddit_video.fallback_url,
      aud = vid.replace(/(?<=DASH_).*/,'audio.mp4');
    return ({ vid, aud })
  } else if (is === 'gallery') {
    return Object.values(v.media_metadata).map((v:any) => v.s.u) as RedditGallery
  } else if (is === 'youtube'){
    const pre = 'https://www.youtube.com/embed/', post = '?feature=oembed&enablejsapi=1';
    return pre + v.url.match(/(?<=(?<=you).*\/).*/)[0] + post;
  } else if (is === 'vimeo') {
    return v.secure_media.oembed.html.match(/https:.*?(?=")/)[0];
  } else if (is === 'gifv'){
    return v.preview.reddit_video_preview.fallback_url
  } else if (is === 'discussion'){
    return v.selftext
  } else {
    const img = v.preview?.images[0].source.url;
    return img ? img : v.url;
  }
}

const getThumbnail = (v: any, is: string): string[] | string => {
  if (is === 'gallery') {
    return Object.values(v.media_metadata).map((img: any) => img.p[2]?.u ?? img.p[1]?.u ?? img.p[0]?.u );
  } else if (is === 'vimeo') {
    return v.secure_media.oembed.thumbnail_url;
  } else if (v.thumbnail === 'default') {
    return '/assets/images/default.png';
  } else if (v.thumbnail === '') {
    return v.url;
  }
  return v.thumbnail.match('http')?.[0] ? v.thumbnail : '';
}

const is_a = (v: any) => ['crosspost','video','gallery','youtube','vimeo','gifv','discussion','image'][[
  "crosspost_parent_list" in v,
  v.is_video || (v.preview && ('reddit_video_preview' in v.preview)),
  v.is_gallery,
  !!v.domain.match(/youtu[\.]*be/),
  !!v.domain.match(/vimeo/),
  !!v.url.match(/\.gifv/),
  v.is_self || !('preview' in v),
  true
].indexOf(true)];

const redditURL = (url: string): string => url.startsWith('/r') ? 'https://www.reddit.com'+url : url;
export const reddit_format = (data: any): RedditPost[] => {
  // console.log('reddit API data: ', data);
  return data.data.children
    .map((v: any) => v.data)
    .map((v: any)=>{
      let is = is_a(v), score = v.score;
      const crosspost = is === 'crosspost';
      if (crosspost) {
        is = is_a(v.crosspost_parent_list[0]);
        v = v.crosspost_parent_list[0];
      }
      return ({
        uid: v.name,
        by: v.author,
        is: is,
        crosspost: crosspost,
        subreddit: v.subreddit,
        num_comments: v.num_comments,
        thread_url: { thread: redditURL(v.permalink), target: redditURL(v.url) },
        thumbnail: getThumbnail(v, is),
        src: formatMedia(v, is),
        score: { onThis: score, onSource: v.score }, // up vs downvote sum
        spoiler: v.spoiler,
        title: v.title,
        upvote_ratio: v.upvote_ratio,
        nsfw: v.over_18
      })
    });
}

export const subreddit_array = (data: any): Subreddit[] => data.data.children.map(single_sub);
export const single_sub = (v: any): Subreddit => ({
  identifier: v.data.name,
  name: v.data.display_name,
  subscribers: v.data.subscribers,
  created_utc: v.data.created_utc * 1000,
  over18: v.data.over18,
  description: v.data.description,
  community_icon: v.data.community_icon,
  icon_img: v.data.icon_img,
  private: v.data.subreddit_type === 'private'
});

export const comment_array = (data: any): RedditComment[] => {
  return data.children.map((v:any) => {
    if (v.kind === 'more') return '';
    return single_comment(v);
  }).filter(String);
}
/** More details */
interface Foo {
  member: boolean;
}
/**
 * Standard links:
 * {@link Foo} or {@linkplain Foo} or [[Foo]]
 *
 * Code links: (Puts Foo inside <code> tags)
 * {@linkcode Foo} or [[`Foo`]]
 */
export const single_comment = (v: any): RedditComment => {
  const childrenData = v.data.replies?.data, exists = childrenData && childrenData.children[childrenData.children.length-1].kind !== 'more';
  return ({
    post_id: v.data.link_id?.match(/(?<=_).*/)?.[0],
    author: v.data.author,
    depth: v.data.depth,
    text_md: v.data.body_html,
    created_utc: v.data.created_utc * 1000,
    permalink: redditURL(v.data.permalink),
    children: exists ? comment_array(childrenData) : [],
    score: v.data.score,
    stickied: v.data.stickied,
    subreddit: v.data.subreddit,
    is_submitter: v.data.is_submitter,
    edited: v.data.edited,
    collapsed: v.data.collapsed
  })
}
