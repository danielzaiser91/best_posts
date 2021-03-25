import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, Observable, of, Subject } from 'rxjs';
import { filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { RedditComment, RedditPost, Subreddit } from '../types';
import {
  reddit_format,
  single_sub,
  subreddit_array,
  comment_array
} from '../functions';
import { StorageService } from './storage.service';

const base = 'https://www.reddit.com/';
export const errHandler = (err: HttpErrorResponse) => {
  console.error('HTTP ERROR: ', err);
  return of(err);
}

export type ObjectString = { [key:string]: string };
export type FilterRedditPost = 'text' | 'videos' | 'images' | '';
const defaultParams = { limit: '25', t: 'day', raw_json: '1', after: '', before: '', count: '25', show: 'all', sort: 'hot', q: '', geo_filter: 'DE', exclude: [''] as FilterRedditPost[] }
export type AllowedParams = Partial<typeof defaultParams>;
const defaultOpts = { sub: 'cats', options: {} as AllowedParams, data: [] as RedditPost[], exclude: [''] as FilterRedditPost[] }
export type CustomOptions = { sub: string, options?: AllowedParams, data?: RedditPost[], exclude: FilterRedditPost[] };

/*    documentation: https://www.reddit.com/dev/api     */
@Injectable({
  providedIn: 'root'
})
export class RedditAPIService {
  constructor(private http: HttpClient, private store: StorageService) { }

  get(subreddit: string, params: AllowedParams = {}, { calledFromGetFiltered = false } = {}): Observable<RedditPost[]> | Subject<RedditPost[]> {
    if (params.exclude?.length && !calledFromGetFiltered) return this.getFiltered(subreddit, params.exclude);
    params = {...defaultParams, ...this.store.userOptions, ...params};
    const exclude = params.exclude;
    delete params.exclude;
    const q = [params.limit, params.t, params.sort, params.q, params.geo_filter, exclude];
    const today = new Date().toDateString(), argsString = JSON.stringify({ subreddit, q, today });
    const cached = this.store.db.apiCache.get({'key': argsString});
    const cachedObs = from(cached.then(x => x?.data)) as Observable<RedditPost[]>;

    return cachedObs.pipe(switchMap(v => {
      const append = params.after?.length || params.before?.length, noCache = !v?.length || append;
      if(noCache) {
        const url = base + 'r/' + subreddit + '/' + (params.sort || defaultParams.sort) + '.json';
        delete params.sort;
        if (params.after?.length) delete params.before;
        else if (params.before?.length) delete params.after;
        else { delete params.after; delete params.before; delete params.count }
        return this.http.get(url, { params: params as ObjectString }).pipe(
          map(reddit_format),
          map(posts => exclude?.length ? this.filterExclude(posts, exclude) : posts),
          tap(tap => {
            if (!append) this.store.db.apiCache.put({ data: tap, key: argsString })
            else {
              this.store.db.transaction('rw', this.store.db.apiCache, () => {
                cached.then(x => {
                  if (x) this.store.db.apiCache.put({ key: x.key, data: [...x.data, ...tap] })
                })
              });
            }
          })
        );
      } else return cachedObs
    }))
  }

  append(subreddit: string) {
    const params = {...defaultParams, ...this.store.userOptions};
    const q = [params.limit, params.t, params.sort, params.q, params.geo_filter, params.exclude];
    const today = new Date().toDateString(), argsString = JSON.stringify({ subreddit, q , today });
    const afterObs = from(this.store.db.apiCache.get({'key': argsString}).then(x => {console.log('after:',x);return x?.data[x.data.length-1].uid}));
    return afterObs.pipe(switchMap(after => this.get(subreddit, { after })));
  }

  getFiltered(sub: string, exclude: FilterRedditPost[]): Subject<RedditPost[]> {
    const result = new Subject<RedditPost[]>();
    this.gatherData(result, { sub, exclude })
    return result;
  }
  // https://www.reddit.com/r/popular/?geo_filter=DE&sort=hot&t=day
  gatherData(res: Subject<RedditPost[]>, opt: CustomOptions, count = 0) {
    const limit = this.store.userOptions.limit;
    let { exclude, sub, data } = {...defaultOpts, ...opt};
    const after = opt.options?.after;
    const callWith = after ? { after, exclude } : { exclude };

    this.get(sub, { ...callWith }, { calledFromGetFiltered: true }).pipe(take(1)).subscribe(v => {
      data = data ? data.concat(v) : v;
      const after = v[v.length-1].uid;
      count++;
      if (data.length < +limit && count < 4) this.gatherData(res, { sub, options: { after }, data, exclude }, count);
      else { res.next(data) }
    })
  }

  filterExclude(data: RedditPost[], exclude: FilterRedditPost[]) {
    const reject = exclude.map(v => ({
      "images": ['gallery', 'image'],
      "text": ['discussion'],
      "videos": ['gifv', 'video', 'youtube', 'vimeo'],
      "": ['']
    })[v]).flat()

    return data.filter(x => !reject.includes(x.is));
  }

  subredditSearch(query: string): Observable<Subreddit[]> {
    const over18 = this.store.userPrefs.over18;
    return this.http.get(base + 'subreddits/search.json?q=' + query + (over18 ? '&include_over_18=on' : '')).pipe(
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
