import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { RedditComment, UserPrefs } from '../types';

class RedditDatabase extends Dexie {
  public comments: Dexie.Table<RedditComment, string>;
  public recommendations: Dexie.Table<RedditComment, string>;

  public constructor() {
    super("redditData");
    this.version(1).stores({
      comments: 'permalink, [subreddit+post_id]',
      recommendations: 'permalink, [subreddit+post_id]'
    });
    this.comments = this.table("comments");
    this.recommendations = this.table("recommendations");
  }
}
const redditDB = new RedditDatabase();

const defaultOptions = { sort: 'hot', t:'day', limit: '25', q: '' };
export type UserOptions = typeof defaultOptions;
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  save = (param: string, data: any) => sessionStorage.setItem(param, JSON.stringify(data));
  getSaved = (param: string) => JSON.parse(sessionStorage.getItem(param) || 'null');
  saveLS = (param: string, data: any) => localStorage.setItem(param, JSON.stringify(data));
  getSavedLS = (param: string) => JSON.parse(localStorage.getItem(param) || 'null');
  clearSS = (param = '', sub = '') => {
    if (param.length !== 0 && sub.length !== 0) {
      const key = param + ':' + sub;
      console.log('deleting Entry '+ param +' from SessionStorage key:', sub);
      const removed = this.getSaved(sub).filter((v: string) => v !== param);
      removed.length ? this.save(sub, removed) : sessionStorage.removeItem(sub);
      console.log('deleting SessionStorage key:', key);
      sessionStorage.removeItem(key);
      return
    }
    sessionStorage.clear();
  };
  anySS = () => sessionStorage.length;
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
