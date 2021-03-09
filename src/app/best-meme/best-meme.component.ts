import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { errHandler, RedditAPIService } from '../reddit-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, debounceTime, take } from 'rxjs/operators';
import { StorageService } from '../storage.service';
import { RedditPost, Subreddit } from '../redditTypes';

@Component({
  selector: 'app-best-meme',
  templateUrl: './best-meme.component.html',
  styleUrls: ['./best-meme.component.sass']
})
export class BestMemeComponent implements OnInit {
  @ViewChild('subredditInput') subredditInput: ElementRef;
  subredditChooser: FormGroup;
  postOptions: FormGroup;
  posts: RedditPost[];
  subExists = true;
  subreddits = ['cats','memes'];
  nextSub = this.subreddits[1];
  currentSub = 'cats';
  suggestions: Subreddit[] = [];
  page = 0;
  loading = false;

  constructor(private api: RedditAPIService, formBuilder: FormBuilder, public store: StorageService) {
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
    // listen on input 10 times per second
    this.subredditChooser.get('subreddit')?.valueChanges.pipe(debounceTime(100)).subscribe((chunk: string) => {
      this.subExists = true;
      if (chunk === '') { this.suggestions = []; return; }
      this.store.reddit.transaction('r', this.store.reddit.meta, () => {
        return this.store.reddit.meta.where('name').startsWithIgnoreCase(chunk).reverse().sortBy('subscribers');
      }).then(suggestions => this.suggestions = suggestions.sort((a: any, b: any) => a.name.toLowerCase() === chunk.toLowerCase() ? -1 : 1) as Subreddit[]);
    }, catchError(errHandler));

    // listen on input once per second
    this.subredditChooser.get('subreddit')?.valueChanges.pipe(debounceTime(1000)).subscribe((chunk: string) => {
      if (chunk === '') return;
      this.api.getSubreddit(this.subredditInput.nativeElement.value).pipe(take(1)).subscribe({next: subreddit => {
        this.subExists = true;
        this.store.reddit.meta.where('name').equalsIgnoreCase(subreddit.name).first().then(v => {
          if (!v) {
            this.suggestions.push(subreddit);
            this.store.reddit.meta.add(subreddit);
          }
        });
      }, error: _ => this.subExists = false });
    }, catchError(errHandler));
  }

  getMetaData() {
    const today = new Date().toDateString();

    // one id for every 100 subreddits for pagination and initial fetch for filling suggestions... kinda todo... replace with ngrx?
    const metaArray = ['','t5_2rlgy','t5_32rww','t5_2s3kh','t5_2qs0q','t5_2tkvu','t5_2qhpm','t5_39umt','t5_30qnb','t5_2qh3r','t5_3fmt2','t5_2qhjq','t5_2rg2o','t5_2s61a',
      't5_37nqy','t5_3aw4y','t5_2qhw9','t5_2yqte','t5_xpfq5','t5_2r8t2','t5_2vso4','t5_2s91q','t5_2rjcb','t5_2rfyw','t5_3ocv3','t5_g53v4','t5_3osjr','t5_2tnbv','t5_2v08h',
      't5_2qsbv','t5_32rtl','t5_3f1y1','t5_3jwwf','t5_3fnyy','t5_gi5ar'];

    console.info('%cfetching subreddit meta-data for the '+metaArray.length*100+' most popular subreddits...','font-size:2em; border:1px solid; padding: 1em; background: #ffe79e; color: black');
    this.store.reddit.transaction('rw', this.store.reddit.meta, async() => {
      const noData = await this.store.reddit.meta.count() === 0;
      const notfetchedToday = this.store.getSaved('meta')?.lastFetch !== today;
      if( notfetchedToday || noData ) {
        this.api.getAllSubreddits(metaArray).pipe(take(1)).subscribe(meta => {
          this.store.save('meta', { lastFetch: today });
          this.store.reddit.meta.clear().then(() => this.store.reddit.meta.bulkPut(meta)).then(_ => {
            this.store.metaDataReady(true);
          });
        }, catchError(errHandler));
      } else this.store.metaDataReady(true);
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
      saved = this.store.getSaved(sub),
      today = new Date().toDateString();
    if(saved?.lastFetch !== today) {
      this.api.get(sub).pipe(take(1)).subscribe((data: RedditPost[]) => {
        if(base) {
          this.posts = data;
          this.loading = false;
        }
        sessionStorage.setItem(sub, JSON.stringify({data, lastFetch: today}));
        this.store.save(sub, {data, lastFetch: today});
        this.currentSub = sub;
        this.subreddits.push(sub);
      }, catchError(errHandler));
    } else {
      this.loading = false;
      if(!!this.posts && this.isCurrentSub(sub)) return; // prevent load of already loaded data
      if(base) {
        console.log(saved.data);
        this.posts = saved.data;
        this.currentSub = sub;
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
