import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
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
  console.error('myErrorHandler: HTTP ERROR: ', err);
  return throwError(err);
}

export type ObjectString = { [key:string]: string };
export type FilterRedditPost = 'text' | 'videos' | 'iframes' | 'images' | '';
const defaultParams = { limit: '25', t: 'day', raw_json: '1', after: '', before: '', count: '25', show: 'all', sort: 'hot', q: '', geo_filter: 'DE', exclude: [''] as FilterRedditPost[] }
export type AllowedParams = Partial<typeof defaultParams>;
const defaultOpts = { sub: 'cats', options: defaultParams, data: [] as RedditPost[], count: 0 }
export type CustomOptions = { sub: string, options?: AllowedParams, data?: RedditPost[], count: number };

/*    documentation: https://www.reddit.com/dev/api     */
@Injectable({
  providedIn: 'root'
})
export class RedditAPIService {
  constructor(private http: HttpClient, private store: StorageService) { }

  get(subreddit: string, params: AllowedParams = {}, { calledFromGetFiltered = false } = {}): Observable<RedditPost[]> | Subject<RedditPost[]> {
    if (params.exclude?.length && !calledFromGetFiltered) return this.getFiltered(subreddit, params);
    params = {...defaultParams, ...this.store.userOptions, ...params};
    const exclude = params.exclude;
    delete params.exclude;
    const q = [params.limit, params.t, params.sort, params.q, params.geo_filter, exclude];
    const today = new Date().toDateString(), argsString = JSON.stringify({ subreddit, q, today });
    const cached = this.store.db.apiCache.get({'key': argsString});
    const cachedObs = from(cached.then(x => x?.data)) as Observable<RedditPost[]>;

    return cachedObs.pipe(switchMap(v => {
      const append = params.after?.length || params.before?.length, hasCache = v?.length;
      if(!hasCache || append) {
        const url = base + 'r/' + subreddit + '/' + (params.sort || defaultParams.sort) + '.json';
        delete params.sort;
        if (params.after?.length) delete params.before;
        else if (params.before?.length) delete params.after;
        else { delete params.after; delete params.before; delete params.count }
        return this.http.get(url, { params: params as ObjectString }).pipe(
          catchError(errHandler),
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
    const afterObs = from(this.store.db.apiCache.get({'key': argsString}).then(x => x?.data[x.data.length-1].uid));
    return afterObs.pipe(switchMap(after => this.get(subreddit, { after })));
  }

  getFiltered(sub: string, options: AllowedParams): Subject<RedditPost[]> {
    const result = new Subject<RedditPost[]>();
    this.gatherData(result, { sub, options, count: 0 })
    return result;
  }

  gatherData(res: Subject<RedditPost[]>, opt: CustomOptions) {
    const options = {...this.store.userOptions, ...opt.options};
    let { sub, data, count } = opt;

    this.get(sub, options, { calledFromGetFiltered: true }).pipe(take(1)).subscribe({next: v => {
      if(!v.length) return res.next(data);
      data = data ? data.concat(v) : v;
      if (data.length < +options.limit && count++ < 4) this.gatherData(res, { sub, options, data, count });
      else { res.next(data) }
    }, error: err => res.error(err)})
  }

  filterExclude(data: RedditPost[], exclude: FilterRedditPost[]) {
    const reject = exclude.map(v => ({
      "images": ['gallery', 'image'],
      "text": ['discussion'],
      "videos": ['gifv', 'video', 'youtube', 'vimeo'],
      "iframes": ['youtube', 'vimeo'],
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
    const options = { params: { raw_json: '1', depth: '4', sort: 'top' }}
    return this.http.get(base + 'r/' + subreddit + '/comments/' + id + '/.json', options).pipe(
      map((v:any)=> v[1].data),
      map(comment_array)
    );
  }

  getPopularSubreddits(): Observable<Subreddit[]> {
    return this.http.get('https://api.reddit.com/subreddits/popular.json?limit=100').pipe(
      map(subreddit_array)
    )
  }
}
