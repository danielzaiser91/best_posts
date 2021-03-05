import { RedditGallery, RedditMedia } from "./redditTypes";

const formatMedia = (v: any): RedditMedia => {
  if(v.is_video) {
    const
      vid = v.media.reddit_video.fallback_url,
      aud = vid.replace(/(?<=DASH_).*/,'audio.mp4');
    return {
      vid: vid,
      aud: aud // todo check if there is an audio file
    }
  } else if(v.is_gallery) {
    return Object.values(v.media_metadata).map((v:any) => v.p[v.p.length-1].u) as RedditGallery
  } else {
    return {
      img: v.url
    }
  }
}

export const reddit_format = (data: any) => {
  return data.data.children
    .map((v: any) => v.data)
    .map((v: any)=>{
      return {
        by: v.author,
        is: ['video','gallery','image'][[v.is_video, v.is_gallery, true].indexOf(true)],
        num_comments: v.num_comments,
        thread_url: { thread: v.permalink, target: v.url },
        thumbnail: v.thumbnail,
        src: formatMedia(v),
        score: v.score, // up vs downvote sum
        spoiler: v.spoiler,
        title: v.title,
        upvote_ratio: v.upvote_ratio
      }
    });
}
