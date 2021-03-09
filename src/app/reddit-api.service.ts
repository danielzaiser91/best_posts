import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { RedditPost, RedditSort, Subreddit } from './redditTypes';
import { reddit_format, single_sub, subreddit_array } from './reddit_format';

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

  get(subreddit: string, sort: RedditSort = 'top'): Observable<RedditPost[]> {
    const options = {
      params: {
        q: ['search','blub'], // filter posts by search query
        t: 'day', // filter by time: hour, day, week, month, all
        limit: '25', // amount of listings: 0-100
        raw_json: '1' // For legacy reasons, all JSON response bodies currently have <, >, and & replaced with &lt;, &gt;, and &amp;, respectively. If you wish to opt out of this behaviour, add a raw_json=1 parameter to your request.
      }
    }
    return this.http.get(base + 'r/' + subreddit + '/' + sort + '.json', options).pipe(
      map(reddit_format)
    );
  }

  getSubreddit(subreddit: string): Observable<Subreddit> {
    return this.http.get(base + 'r/' + subreddit + '/about.json').pipe(
      map(single_sub)
    );
  }

  specific(): Observable<Subreddit[]> {
    const options = { params: { show: 'all', limit: '100', after: 't5_3fnyy', count: "100" } }
    return this.http.get('https://api.reddit.com/subreddits/.json', options).pipe(
      map(subreddit_array)
    )
  }

  getAllSubreddits(arr: string[]): Observable<Subreddit[]> {
    let options = {}
    const myRequests = arr.map((v:string)=>{
      options = { params: { show: 'all', limit: '100', after: v, count: "100" } }
      if(v='') options = { params: { show: 'all', limit: '100' } }
      return this.http.get('https://api.reddit.com/subreddits/.json', options).pipe(
        map(subreddit_array)
      )
    });
    return forkJoin(myRequests).pipe(mergeMap(v=>v));
  }
}
