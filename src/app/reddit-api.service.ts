import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, debounceTime, map } from 'rxjs/operators';
import { RedditSort } from './redditTypes';
import { reddit_format } from './reddit_format';

const base = 'https://www.reddit.com/';
const errHandler = (err: HttpErrorResponse) => {
  console.error('HTTP ERROR: ', err);
  return of(err);
}

@Injectable({
  providedIn: 'root'
})
export class RedditAPIService {
  constructor(private http: HttpClient) { }

  get(subreddit: string, sort: RedditSort = 'top') {
    const options = {
      params: {
        q: ['search','blub'], // filter posts by search query
        t: 'day', // filter by time: hour, day, week, month, all
        limit: '25', // amount of listings: 0-100
        raw_json: '1' // For legacy reasons, all JSON response bodies currently have <, >, and & replaced with &lt;, &gt;, and &amp;, respectively. If you wish to opt out of this behaviour, add a raw_json=1 parameter to your request.
      }
    }
    return this.http.get(base + 'r/' + subreddit + '/' + sort + '.json', options).pipe(
      map(reddit_format),
      catchError(errHandler)
    );
  }

  subExists(subreddit: string) {
    return this.http.get(base + 'r/' + subreddit + '.json').pipe(
      debounceTime(100)
    )
  }
}
