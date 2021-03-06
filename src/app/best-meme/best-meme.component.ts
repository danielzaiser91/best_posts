import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { RedditAPIService } from '../reddit-api.service';
import Dexie from 'dexie';
import { Subreddit } from '../redditTypes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface SubredditTable extends Partial<Subreddit> {
  id?: number
}

class RedditDatabase extends Dexie {
  public meta: Dexie.Table<SubredditTable, number>; // id is number in this case

  public constructor() {
    super("redditData");
    this.version(1).stores({
      meta: '++id, identifier, name, subscribers, created_utc, over18, description, community_icon, icon_img',
    });
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
  @ViewChild('el') el: ElementRef;
  subredditChooser: FormGroup;
  postOptions: FormGroup;
  posts: any;
  subExists = false;
  subreddits = ['memes','cats']
  sub = this.subreddits[0];
  currentSub = 'cats';
  meta: any[];

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
    this.subredditChooser.valueChanges.pipe(debounceTime(100)).subscribe((v:any) => {
      // todo: add subreddit dropdown suggestion
      // this.subredditChooser.get('subreddit')?.value;
    });
    this.subredditChooser.valueChanges.pipe(debounceTime(1000)).subscribe((v:any) => {
      const $temp: Subscription = this.api.subExists(this.el.nativeElement.value).subscribe(
        _ => {this.subExists = true; $temp.unsubscribe(); },
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

    console.info('%cfetching subreddit meta-data for: '+arr.length*100+' subreddits...','font-size:2em; border:1px solid; padding: 1em; background: #ffe79e; color: black');
    db.transaction('r', db.meta, async() => {
      const noData = await db.meta.count() === 0;
      const notfetchedToday = getSaved('meta')?.lastFetch !== today;
      if( notfetchedToday || noData ) {
        this.api.getAllSubreddits(arr).subscribe(async meta => {
          this.meta = meta;
          save('meta', { lastFetch: today });
          await db.meta.bulkPut(meta);
        });
      } else {
        this.meta = await db.meta.toArray();
      }
    });
  }

  isCurrentSub(sub: string): boolean {
    return this.currentSub === sub;
  }

  fetchSub(sub: string, base = false) {
    const
      saved = getSaved(sub),
      today = new Date().toDateString();
    if(saved?.lastFetch !== today) {
      const a = this.api.get(sub).subscribe(data => {
        a.unsubscribe();
        if(base) this.posts = data;
        sessionStorage.setItem(sub, JSON.stringify({data, lastFetch: today}));
        save(sub, {data, lastFetch: today});
        this.currentSub = sub;
      });
    } else {
      if(!!this.posts && this.isCurrentSub(sub)) return; // prevent load of already loaded data
      if(base) {
        console.log(saved.data);
        this.posts = saved.data;
        this.currentSub = sub;
      }
    }
  }

  onInput() {}

  getNextSubreddit() {
    let i = this.subreddits.indexOf(this.sub);
    i = (!!this.subreddits[i+1]) ? 0 : i+1;
    this.sub = this.subreddits[i];
    this.fetchSub(this.sub, true);
  }

  hideOverlay(e: any) { if(e.target.classList.contains('optionsOverlay')) e.target.classList.remove('fullscreen') }
}
