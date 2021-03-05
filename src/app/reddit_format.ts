import { RedditMedia } from "./redditTypes";
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

async function mergeVideo(video: string, audio: string) {
  let ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(video));
  ffmpeg.FS('writeFile', 'audio.mp4', await fetchFile(audio));
  await ffmpeg.run('-i', 'video.mp4', '-i', 'audio.mp4', '-c', 'copy', 'output.mp4');
  let data = await ffmpeg.FS('readFile', 'output.mp4');
  return new Uint8Array(data.buffer);
};
// memory exceeded crash...
const getSrc = (v:any) => {
  if(v.is_video) {
    const vid = v.media.reddit_video.fallback_url, aud = vid.replace(/(?<=DASH_).*/,'audio.mp4');
    return mergeVideo(vid, aud)
  }
  return v.url
}
const formatMedia = (v: any): RedditMedia => {
  if(v.is_video) {
    const vid = v.media.reddit_video.fallback_url;
    return {
      vid: vid,
      aud: vid.replace(/(?<=DASH_).*/,'audio.mp4')
    }
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
        is_video: v.is_video,
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
