import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { RedditComment, UserPrefs } from '../types';

class RedditDatabase extends Dexie {
  public comments: Dexie.Table<RedditComment, string>;

  public constructor() {
    super("redditData");
    this.version(1).stores({
      comments: 'permalink, [subreddit+post_id]'
    });
    this.comments = this.table("comments");
  }
}
const redditDB = new RedditDatabase();

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
  get userOptions() { return this.getSavedLS('userOptions') || { sort: 'hot', params: { t:'day', limit: '25', q: '' }}; }

  preferences({...args}) {
    this.userPrefs = Object.assign(this.userPrefs ?? {}, args)
  }

  get userPrefs(): UserPrefs {
    return this.getSavedLS('userPrefs') || { volume: 1 };
  }
  set userPrefs(prefs: UserPrefs) {
    this.saveLS('userPrefs', prefs);
  }
}
