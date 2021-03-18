import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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

@Injectable({
  providedIn: 'root'
})
export class RedditAPIService {
  constructor(private http: HttpClient) { }

  get(subreddit: string, { params = { limit: '25' }, sort = 'hot' } = {}, id = ''): Observable<RedditPost[]> {
    if (params) {}
    if (id.length) Object.assign(params, { after: id, count: params.limit });
    const options = {
      params: Object.assign({
        // --- for some reasons these options dont seem to work as expected
        // q: ['search','blub'], // filter posts by search query
        t: 'day', // filter by time: hour, day, week, month, all
        limit: '25', // amount of listings: 0-100
        raw_json: '1' // For legacy reasons, all JSON response bodies currently have <, >, and & replaced with &lt;, &gt;, and &amp;, respectively. If you wish to opt out of this behaviour, add a raw_json=1 parameter to your request.
      }, params)
    }
    return this.http.get(base + 'r/' + subreddit + '/' + sort + '.json', options).pipe(
      map(reddit_format)
    );
  }

  subredditSearch(query: string): Observable<Subreddit[]> {
    return this.http.get(base + 'subreddits/search.json?q=' + query).pipe(
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

  getSubreddit(subreddit: string): Observable<Subreddit> {
    return this.http.get(base + 'r/' + subreddit + '/about.json').pipe(
      map(single_sub)
    );
  }

  getPopularSubreddits(): Observable<Subreddit[]> {
    return this.http.get('https://api.reddit.com/subreddits/popular.json?limit=100').pipe(
      map(subreddit_array)
    )
  }

  getAllSubreddits(arr: string[]): Observable<Subreddit[]> {
    let options = {}
    const myRequests = arr.map((v:string)=>{
      options = { params: { show: 'all', limit: '100', after: v, count: "100" } }
      if (v === '') options = { params: { show: 'all', limit: '100' } }
      return this.http.get('https://api.reddit.com/subreddits/.json', options).pipe(
        map(subreddit_array)
      )
    });
    return forkJoin(myRequests).pipe(mergeMap(v=>v));
  }
}
