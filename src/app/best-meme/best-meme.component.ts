import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RedditAPIService } from '../reddit-api.service';
import Dexie from 'dexie';
import { Subreddit } from '../redditTypes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface SubredditTable extends Partial<Subreddit> {
  id?: number
}
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
const db = new RedditDatabase();

const getSaved = (param: string) => JSON.parse(sessionStorage.getItem(param) || 'null');
const save = (param: string, data: any) => sessionStorage.setItem(param, JSON.stringify(data));

@Component({
  selector: 'app-best-meme',
  templateUrl: './best-meme.component.html',
  styleUrls: ['./best-meme.component.sass']
})
export class BestMemeComponent implements OnInit {
  @ViewChild('subredditInput') subredditInput: ElementRef;
  subredditChooser: FormGroup;
  postOptions: FormGroup;
  posts: any;
  subExists = false;
  subreddits = ['cats','memes'];
  nextSub = this.subreddits[1];
  currentSub = 'cats';
  meta: any[] = [];
  suggestions: any[];
  page = 0;
  loading = false;

  constructor(private api: RedditAPIService, formBuilder: FormBuilder) {
    this.subredditChooser = formBuilder.group({ subreddit: [''] });
    this.postOptions = formBuilder.group({
      num_posts: ['', Validators.required],
      sort: [''],
      time: [''],
      query: ['']
    })
  }

  ngOnInit(): void {
    this.fetchSub('memes');
    this.fetchSub('cats', true);
    this.getMetaData();
    this.activateFormValidators();
  }

  activateFormValidators() {
    this.subredditChooser.get('subreddit')?.valueChanges.pipe(debounceTime(100)).subscribe((chunk: string) => {
      if (chunk === '') {
        this.suggestions = [];
        return;
      }
      db.transaction('r', db.meta, () => {
        return db.meta.where('name').startsWithIgnoreCase(chunk).reverse().sortBy('subscribers');
      }).then(suggestions => this.suggestions = suggestions.sort((a: any, b: any) => a.name.toLowerCase() === chunk.toLowerCase() ? -1 : 1)).then(console.log);
    });
    this.subredditChooser.get('subreddit')?.valueChanges.pipe(debounceTime(1000)).subscribe((chunk: string) => {
      if (chunk === '') return;
      const $temp: Subscription = this.api.subExists(this.subredditInput.nativeElement.value).subscribe(
        (subreddit: any) => {
          this.subExists = true;
          $temp.unsubscribe();
          if(!this.suggestions.length) this.suggestions.push({ name: subreddit.data.children[0].data.subreddit });
        },
        err => this.subExists = false,
      );
    });
  }

  getMetaData() {
    const today = new Date().toDateString();

    // every 100 subreddit ids for pagination and initial fetch for filling suggestions... kinda todo...
    const arr = ['','t5_2rlgy','t5_32rww','t5_2s3kh','t5_2qs0q','t5_2tkvu','t5_2qhpm','t5_39umt','t5_30qnb','t5_2qh3r','t5_3fmt2','t5_2qhjq','t5_2rg2o','t5_2s61a','t5_37nqy','t5_3aw4y',
    't5_2qhw9','t5_2yqte','t5_xpfq5','t5_2r8t2','t5_2vso4','t5_2s91q','t5_2rjcb','t5_2rfyw','t5_3ocv3','t5_g53v4','t5_3osjr','t5_2tnbv','t5_2v08h','t5_2qsbv','t5_32rtl','t5_3f1y1',
    't5_3jwwf','t5_3fnyy','t5_gi5ar'];

    console.info('%cfetching subreddit meta-data for the '+arr.length*100+' most popular subreddits...','font-size:2em; border:1px solid; padding: 1em; background: #ffe79e; color: black');
    db.transaction('rw', db.meta, async() => {
      const noData = await db.meta.count() === 0;
      const notfetchedToday = getSaved('meta')?.lastFetch !== today;
      if( notfetchedToday || noData ) {
        this.api.getAllSubreddits(arr).subscribe(async meta => {
          meta = flattenDeep(meta);
          save('meta', { lastFetch: today });
          function flattenDeep(arr1: any[]): any[] {
            return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
          }
          await db.meta.clear().then(() => db.meta.bulkPut(meta)).then(() => this.meta = meta);
          console.log(this.meta);
        });
      } else {
        if(!this.meta?.length) this.meta = await db.meta.toArray();
        console.log(this.meta);
      }
    });
  }

  isCurrentSub(sub: string): boolean {
    return this.currentSub === sub;
  }

  fetchSub(sub: string, base = false) {
    if (base) this.loading = true;
    this.suggestions = [];
    if (this.subredditInput) this.subredditInput.nativeElement.value = sub;
    console.log(sub);
    const
      saved = getSaved(sub),
      today = new Date().toDateString();
    if(saved?.lastFetch !== today) {
      const a = this.api.get(sub).subscribe(data => {
        a.unsubscribe();
        if(base) {
          this.posts = data;
          this.loading = false;
        }
        sessionStorage.setItem(sub, JSON.stringify({data, lastFetch: today}));
        save(sub, {data, lastFetch: today});
        this.currentSub = sub;
        this.subreddits.push(sub);
      });
    } else {
      console.log('return hier??', this.isCurrentSub(sub));
      if(!!this.posts && this.isCurrentSub(sub)) return; // prevent load of already loaded data
      if(base) {
        console.log(saved.data);
        this.posts = saved.data;
        this.currentSub = sub;
        this.loading = false;
      }
    }
  }

  getNextSubreddit() {
    let i = this.subreddits.indexOf(this.nextSub);
    i = (!this.subreddits[i+1]) ? 0 : i+1;
    this.fetchSub(this.nextSub, true);
    this.nextSub = this.subreddits[i];
  }

  hideOverlay(e: any) { if(e.target.classList.contains('optionsOverlay')) e.target.classList.remove('fullscreen') }
}
