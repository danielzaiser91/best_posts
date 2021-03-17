import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, take } from 'rxjs/operators';

import { errHandler, RedditAPIService } from 'app/services/reddit-api.service';
import { StorageService } from 'app/services/storage.service';
import { RedditPost, Subreddit } from 'app/types';
import { uniq } from 'app/functions';

@Component({
  selector: 'app-best-meme',
  templateUrl: './best-meme.component.html',
  styleUrls: ['./best-meme.component.sass']
})
export class BestMemeComponent implements OnInit {
  subredditChooser: FormControl;
  postOptions: FormGroup;
  posts: RedditPost[] = [];
  subExists = true;
  currentSub = 'cats';
  suggestions: Subreddit[] = [];
  page = 0;
  loading = false;
  err = '';

  constructor(
    private api: RedditAPIService,
    private formBuilder: FormBuilder,
    public store: StorageService,
    private route: ActivatedRoute,
    private router: Router)
  {
    this.subredditChooser = new FormControl('');
    const opt = store.userOptions;
    this.postOptions = formBuilder.group({
      perPage: [opt.params.limit, Validators.required],
      sort: [opt.sort, Validators.required],
      time: [opt.params.t, Validators.required],
      query: [opt.params.q]
    })
  }

  ngOnInit(): void {
    this.initialFetch();
    this.activateFormValidators();
  }

  initialFetch(): void {
    const sub = this.route.snapshot.params.subreddit;
    if (sub) this.fetchSub(sub, true);
    else {
      this.fetchSub('memes');
      this.fetchSub('cats', true);
    }
  }

  activateFormValidators() {
    const options = this.store.userOptions;
    this.postOptions.patchValue({
      perPage: options.params.limit,
      sort: options.sort,
      time: options.params.t,
      query: options.params.q
    });

    this.subredditChooser.valueChanges.pipe(debounceTime(500)).subscribe((chunk: string) => {
      if (chunk === '') return;
      this.subExists = true;
      this.api.subredditSearch(chunk).pipe(take(1)).subscribe({
        next: subreddits => {
          this.suggestions = subreddits;
        },
        error: err => {
          errHandler(err);
          this.subExists = false;
          this.suggestions = [];
        }
      })
    }, errHandler);
    this.postOptions.valueChanges.subscribe(form => {
      this.store.saveLS('userOptions', { sort: form.sort, params: { t: form.time, limit: form.perPage, q: form.query } } );
    });
  }

  fetchSub(sub: string, base = false) {
    if (this.posts.length && this.currentSub === sub) return;
    if (base) this.loading = true;
    this.router.navigate(['/r', sub]);
    this.suggestions.length = 0;
    /*
      user options:
      - sortieren nach
      - wieviele ergebnisse pro seite
      - zeitraum filter
      - query filter
      - ...
    */
    const options = this.store.userOptions;
    const optionsString = options.sort+':'+ Object.values(options.params).join(':');
    /* 
      we are caching redditPosts depending on specific user options 
      caching example:
      subreddit: sorted by hot, filtered by day => hot:day:cats ---> RedditPost[] --- notice, we dont differentiate the limits param
      subreddit: sorted by hot, filtered by day => hot:day:memes ---> RedditPost[]
      subredditArr: sorted by hot, filtered by day => hot:day ---> ['cats', 'memes']
    */
    const saved = this.store.getSaved(optionsString+':'+sub), today = new Date().toDateString();
    if (saved?.lastFetch !== today) {
      console.info('fetching data for /r/'+sub+'...');
      this.err = '';
      this.api.get(sub, options).pipe(take(1)).subscribe((data: RedditPost[]) => {
        console.log('received: ', data, 'for options: ', options);
        if (base) {
          this.posts = data;
          this.loading = false;
          this.currentSub = sub;
        }
        this.store.save(optionsString+':'+sub, {data, lastFetch: today});
        const savedArr = this.store.getSaved(sub) || [];
        savedArr.push(optionsString);
        this.store.save(sub, uniq(savedArr));
      }, err => {
        this.loading = false;
        this.currentSub = sub;
        this.err = err.error.reason;
      });
    } else {
      this.loading = false;
      if (base) {
        this.posts = saved.data;
        this.currentSub = sub;
      }
    }
  }

  deleteCache(method: string) {
    switch(method) {
      case 'all': {
        return this.store.clearSS()
      }
      case 'options-specific': {
        const options = this.store.userOptions;
        const optionsString = options.sort+':'+ Object.values(options.params).join(':');
        return this.store.clearSS(optionsString, this.currentSub)
      }
      default:
        return
    }
  }

  onPrivateClick() {
    const msg = 'Dieser Subreddit ist privat, wenn du Mitglied bist, kannst du dich auf reddit.com einloggen um ihn anzusehen.'
    alert(msg);
  }

  hideOverlay(e: any) { if (e.target.classList.contains('optionsOverlay')) e.target.classList.remove('fullscreen') }
}
