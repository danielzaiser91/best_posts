import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Subject } from 'rxjs';
import { SubredditTable } from './redditTypes';

class RedditDatabase extends Dexie {
  public meta: Dexie.Table<SubredditTable, number>; // id is number in this case

  public constructor() {
    super("redditData");
    const version = this.version(1).stores({
      meta: '++id, identifier, name, subscribers, created_utc, over18, description, community_icon, icon_img',
    });
    console.log(version);
    this.meta = this.table("meta");
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
  get reddit() { return redditDB; }
  get user() { return this.getSavedLS('user'); }
  metaDataState = new Subject<boolean>();
  metaDataReady = (status: boolean) => {
    console.log('ready');
    this.metaDataState.next(status)};
}
