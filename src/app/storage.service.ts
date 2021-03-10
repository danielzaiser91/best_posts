import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Subject } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { errHandler, RedditAPIService } from './reddit-api.service';
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
  constructor (private api: RedditAPIService) {}
  save = (param: string, data: any) => sessionStorage.setItem(param, JSON.stringify(data));
  getSaved = (param: string) => JSON.parse(sessionStorage.getItem(param) || 'null');
  saveLS = (param: string, data: any) => localStorage.setItem(param, JSON.stringify(data));
  getSavedLS = (param: string) => JSON.parse(localStorage.getItem(param) || 'null');
  get reddit() { return redditDB; }
  get user() { return this.getSavedLS('user'); }
  metaDataState = new Subject<boolean>();
  metaDataReady = (status: boolean) => this.metaDataState.next(status);

  fetchMetaData() {
    const today = new Date().toDateString();

    // one id for every 100 subreddits for pagination and initial fetch for filling suggestions... kinda todo... replace with ngrx?
    const metaArray = ['','t5_2rlgy','t5_32rww','t5_2s3kh','t5_2qs0q','t5_2tkvu','t5_2qhpm','t5_39umt','t5_30qnb','t5_2qh3r','t5_3fmt2','t5_2qhjq','t5_2rg2o','t5_2s61a',
      't5_37nqy','t5_3aw4y','t5_2qhw9','t5_2yqte','t5_xpfq5','t5_2r8t2','t5_2vso4','t5_2s91q','t5_2rjcb','t5_2rfyw','t5_3ocv3','t5_g53v4','t5_3osjr','t5_2tnbv','t5_2v08h',
      't5_2qsbv','t5_32rtl','t5_3f1y1','t5_3jwwf','t5_3fnyy','t5_gi5ar'];

    console.info('%cfetching subreddit meta-data for the '+metaArray.length*100+' most popular subreddits...','font-size:2em; border:1px solid; padding: 1em; background: #ffe79e; color: black');
    this.reddit.transaction('rw', this.reddit.meta, async() => {
      const noData = await this.reddit.meta.count() === 0;
      const notfetchedToday = this.getSaved('meta')?.lastFetch !== today;
      if( notfetchedToday || noData ) {
        this.metaDataReady(false);
        this.api.getAllSubreddits(metaArray).pipe(take(1)).subscribe(meta => {
          this.save('meta', { lastFetch: today });
          this.reddit.meta.clear().then(() => this.reddit.meta.bulkPut(meta)).then(_ => {
            this.metaDataReady(true);
          });
        }, catchError(errHandler));
      } else this.metaDataReady(true);
    });
  }
}
