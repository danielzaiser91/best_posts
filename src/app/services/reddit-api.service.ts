import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { filter, map, mergeMap, take } from 'rxjs/operators';
import { RedditComment, RedditPost, Subreddit } from '../types';
import {
  reddit_format,
  single_sub,
  subreddit_array,
  comment_array
} from '../functions';

const base = 'https://www.reddit.com/';
export const errHandler = (err: HttpErrorResponse) => {
  console.error('HTTP ERROR: ', err);
  return of(err);
}

const defaultParams = { limit: '25', t: 'day', raw_json: '1', after: '', before: '', count: '25', show: 'all', sort: 'hot', q: '', geo_filter: 'DE' }
export type AllowedParams = Partial<typeof defaultParams>;
export type ObjectString = { [key:string]: string };
export type FilterRedditPost = 'text' | 'videos' | 'images' | '';
const defaultOpts = { sub: 'cats', userOptions: {} as AllowedParams, data: [] as RedditPost[], exclude: [''] as FilterRedditPost[] }
export type CustomOptions = Partial<typeof defaultOpts>;

/*    documentation: https://www.reddit.com/dev/api     */
@Injectable({
  providedIn: 'root'
})
export class RedditAPIService {
  constructor(private http: HttpClient) { }

  get(subreddit: string, params: AllowedParams): Observable<RedditPost[]> {
    const url = base + 'r/' + subreddit + '/' + (params.sort || defaultParams.sort) + '.json';
    params = {...defaultParams, ...params};
    delete params.sort;
    if (params.after?.length) delete params.before;
    else if (params.before?.length) delete params.after;
    else { delete params.after; delete params.before; delete params.count }

    console.log('url: ', url, params);
    return this.http.get(url, { params: params as ObjectString }).pipe(
      map(reddit_format)
    );
  }

  // todo: allow user Options
  getFiltered(sub: string, exclude: FilterRedditPost[], userOptions = {} as AllowedParams): Subject<RedditPost[]> {
    const result = new Subject<RedditPost[]>();
    this.gatherData(result, { sub, exclude, userOptions })
    return result;
  }

  // https://www.reddit.com/r/popular/?geo_filter=DE&sort=hot&t=day
  gatherData(res: Subject<RedditPost[]>, opt: CustomOptions, count = 0) {
    const { exclude, sub, userOptions, data } = {...defaultOpts, ...opt};
    console.log('called fn', count);
    const reject = exclude.map(v => ({
      "images": ['gallery', 'image'],
      "text": ['discussion'],
      "videos": ['gifv', 'video', 'youtube', 'vimeo'],
      "": ['']
    })[v]).flat()

    this.get(sub, userOptions).pipe(take(1)).subscribe(v => {
      let found = false;
      const filtered = v.filter(x => {
        const yes = reject.includes(x.is);
        if (yes) found = true;
        return !yes
      });
      data.push(...filtered);
      count++;
      console.log(v);
      if (found && count < 4) this.gatherData(res, { sub, userOptions: { ...userOptions, after: v[v.length-1].uid }, data, exclude }, count);
      else {
        res.next(data);
      }
    })
  }

  subredditSearch(query: string, includeOver18 = false): Observable<Subreddit[]> {
    return this.http.get(base + 'subreddits/search.json?q=' + query + (includeOver18 ? '&include_over_18=on' : '')).pipe(
      map(subreddit_array)
    );
  }

  getComments(subreddit: string, id: string): Observable<RedditComment[]> {
    // https://www.reddit.com/dev/api#GET_comments_{article}
    const options = { params: {
      raw_json: '1',
      depth: '4',
      sort: 'top'
    }}
    return this.http.get(base + 'r/' + subreddit + '/comments/' + id + '/.json', options).pipe(
      map((v:any)=> v[1].data),
      map(comment_array)
    );
  }

  // getSubreddit(subreddit: string): Observable<Subreddit> {
  //   return this.http.get(base + 'r/' + subreddit + '/about.json').pipe(
  //     map(single_sub)
  //   );
  // }

  getPopularSubreddits(): Observable<Subreddit[]> {
    return this.http.get('https://api.reddit.com/subreddits/popular.json?limit=100').pipe(
      map(subreddit_array)
    )
  }

  // getAllSubreddits(arrOfAfterIds: string[]): Observable<Subreddit[]> {
  //   let options = {}
  //   const myRequests = arrOfAfterIds.map((v:string)=>{
  //     options = { params: { show: 'all', limit: '100', after: v, count: "100" } }
  //     if (v === '') options = { params: { show: 'all', limit: '100' } }
  //     return this.http.get('https://api.reddit.com/subreddits/.json', options).pipe(
  //       map(subreddit_array)
  //     )
  //   });
  //   return forkJoin(myRequests).pipe(mergeMap(v=>v));
  // }
}
