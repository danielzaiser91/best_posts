import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { RedditComment, RedditPost, UserPrefs } from '../types';
import { FilterRedditPost } from './reddit-api.service';

export interface APICache {
  key: string,
  data: RedditPost[]
}
class RedditDatabase extends Dexie {
  public comments: Dexie.Table<RedditComment, string>;
  public apiCache: Dexie.Table<APICache, string>;

  public constructor() {
    super("redditData");
    this.version(2).stores({
      comments: 'permalink, [subreddit+post_id]',
      apiCache: 'key'
    });
    this.comments = this.table("comments");
    this.apiCache = this.table("apiCache");
  }
}
const redditDB = new RedditDatabase();

const defaultOptions = { sort: 'top', t:'day', limit: '25', q: '', exclude: ['text', 'iframes'] as FilterRedditPost[] };
export type UserOptions = typeof defaultOptions;
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  saveLS = (param: string, data: any) => localStorage.setItem(param, JSON.stringify(data));
  getSavedLS = (param: string) => JSON.parse(localStorage.getItem(param) || 'null');

  get db() { return redditDB; }
  get userOptions(): UserOptions { return this.getSavedLS('userOptions') ?? defaultOptions; }

  preferences({...args}) {
    this.userPrefs = Object.assign(this.userPrefs ?? {}, args)
  }

  get userPrefs(): UserPrefs {
    return this.getSavedLS('userPrefs') || { volume: 1, over18: false, warn18: true, warnSpoiler: true };
  }
  set userPrefs(prefs: UserPrefs) {
    this.saveLS('userPrefs', prefs);
  }
}
