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

const defaultParams = { limit: '25', t: 'day', raw_json: '1', after: '', before: '', count: '25', show: 'all', sort: 'hot', q: '' }
export type AllowedParams = Partial<typeof defaultParams>;
export type ObjectString = { [key:string]: string };
export type FilterRedditPost = 'text' | 'videos' | 'images' | '';
const defOpts = { after: '', sub: 'cats', userOptions: {}, data: [] as RedditPost[], exclude: [''] as FilterRedditPost[] }
export type CustomOptions = Partial<typeof defOpts>;

/*    documentation: https://www.reddit.com/dev/api     */
@Injectable({
  providedIn: 'root'
})
export class RedditAPIService {
  constructor(private http: HttpClient) { }

  get(subreddit: string, params: AllowedParams): Observable<RedditPost[]> {
    const url = base + 'r/' + subreddit + '/' + (params.sort || defaultParams.sort) + '.json';
    params = Object.assign(defaultParams, params);
    delete params.sort;
    if (params.after?.length) Object.assign(params, { after: params.after, count: params.count });
    else if (params.before?.length) Object.assign(params, { before: params.before, count: params.count });
    else { delete params.after; delete params.before; delete params.count }

    console.log('url: ', url, params);
    return this.http.get(url, { params: params as ObjectString }).pipe(
      map(reddit_format)
    );
  }

  // todo: add param except type
  exclude(sub: string, exclude: FilterRedditPost[]): Subject<RedditPost[]> {
    const result = new Subject<RedditPost[]>();
    this.gatherData(result, { sub, exclude })
    return result;
  }
// https://www.reddit.com/r/popular/?geo_filter=DE&sort=hot&t=day
  count = 0;
  gatherData(res: Subject<RedditPost[]>, opt: CustomOptions) {
    const { exclude, sub, userOptions, after, data } = Object.assign(defOpts, opt);
    console.log('called fn', this.count);
    const reject = exclude.map(v => ({
      "images": ['gallery', 'image'],
      "text": ['discussion'],
      "videos": ['gifv', 'video', 'youtube', 'vimeo'],
      "": ['']
    })[v]).flat()

    this.get(sub, {...userOptions, after}).pipe(take(1)).subscribe(v => {
      let found = false;
      const filtered = v.filter(x => {
        const yes = reject.includes(x.is);
        if (yes) found = true;
        return !yes
      });
      data.push(...filtered);
      this.count++;
      console.log(v);
      if (found && this.count < 4) this.gatherData(res, { after: v[v.length-1].uid, sub, userOptions, data, exclude });
      else {
        res.next(data);
        this.count = 0;
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
