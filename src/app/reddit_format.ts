import { RedditGallery, RedditMedia, RedditPost, Subreddit } from "./redditTypes";

const formatMedia = (v: any, is: string): RedditMedia => {
  if (is === 'video') {
    const
      vid = v.media.reddit_video.fallback_url as string,
      aud = vid.replace(/(?<=DASH_).*/,'audio.mp4') as string;
    return {
      vid: vid,
      aud: aud // todo check if there is an audio file
    }
  } else if (is === 'gallery') {
    return Object.values(v.media_metadata).map((v:any) => v.p[v.p.length-1].u) as RedditGallery
  } else if (is === 'youtube'){
    return v.secure_media_embed.content.match(/http.*(?=\")/)[0]
  } else if (is === 'gifv'){
    return v.preview.reddit_video_preview.fallback_url
  } else if (is === 'discussion'){
    return v.selftext
  } else {
    const imgs = v.preview?.images[0].resolutions;
    return imgs ? imgs[imgs.length-1].url : v.url;
  }
}
const redditURL = (url: string): string => url.startsWith('/r') ? 'https://www.reddit.com'+url : url;
export const reddit_format = (data: any): RedditPost[] => {
  console.log(data);
  return data.data.children
    .map((v: any) => v.data)
    .map((v: any)=>{
      const is = ['video','gallery','youtube','gifv','discussion','image'][[
        v.is_video,
        v.is_gallery,
        !!v.domain.match(/youtu[\.]*be/),
        !!v.url.match(/\.gifv/),
        v.is_self,
        true
      ].indexOf(true)], fallback = v.thumbnail === 'default';
      return {
        by: v.author,
        is: is,
        num_comments: v.num_comments,
        thread_url: { thread: redditURL(v.permalink), target: redditURL(v.url) },
        thumbnail: v.is_gallery ? Object.values(v.media_metadata).map((img: any) => img.p[2].u) : (fallback ? 'default' : v.thumbnail),
        src: formatMedia(v, is),
        score: v.score, // up vs downvote sum
        spoiler: v.spoiler,
        title: v.title,
        upvote_ratio: v.upvote_ratio,
        nsfw: v.over_18
      }
    });
}

export const subreddit_array = (data: any): Subreddit[] => data.data.children.map(single_sub);
export const single_sub = (v: any): Subreddit => ({
  identifier: v.data.name,
  name: v.data.display_name,
  subscribers: v.data.subscribers,
  created_utc: v.data.created_utc,
  over18: v.data.over18,
  description: v.data.description,
  community_icon: v.data.community_icon,
  icon_img: v.data.icon_img
});
