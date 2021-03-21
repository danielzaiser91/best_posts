import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, first, take } from 'rxjs/operators';

import { StorageService, errHandler, RedditAPIService } from 'app/services';
import { Recommendation, RedditPost, Subreddit } from 'app/types';
import { uniq } from 'app/functions';



@Component({
  selector: 'app-best-meme',
  templateUrl: './best-meme.component.html',
  styleUrls: ['./best-meme.component.sass']
})
export class BestMemeComponent implements OnInit {
  subredditChooser: FormControl;
  postOptions: FormGroup;
  userPrefs: FormGroup;
  posts: RedditPost[] = [];
  subExists = true;
  currentSub = '';
  suggestions: Subreddit[] = [];
  page = 0;
  loading = false;
  err = '';
  cacheNr = 0;

  constructor(
    private api: RedditAPIService,
    formBuilder: FormBuilder,
    public store: StorageService,
    private route: ActivatedRoute,
    private router: Router)
  {
    this.subredditChooser = new FormControl('');
    const opt = store.userOptions;
    const userPrefs = store.userPrefs;
    this.postOptions = formBuilder.group({
      perPage: [opt.params.limit, Validators.required],
      sort: [opt.sort, Validators.required],
      time: [opt.params.t, Validators.required],
      query: [opt.params.q]
    })
    this.userPrefs = formBuilder.group({
      over18: [userPrefs.over18],
      warn18: [userPrefs.warn18],
      warnSpoiler: [userPrefs.warnSpoiler]
    })
  }

  ngOnInit(): void {
    if ('subreddit' in this.route.snapshot.params) this.initialFetch();
    else this.loadRecommendations()
    this.activateFormValidators();
  }

  recommendations: Recommendation[] = [];
  async loadRecommendations() {
    this.recommendations = [
      { category: 'funny', suggestions: await this.getSuggestions('funny'), title: 'lustige Subreddits' },
      { category: 'politics', suggestions: await this.getSuggestions('politics'), title: 'Politische Subreddits' },
      { category: 'interesting', suggestions: await this.getSuggestions('interesting'), title: 'interessante Subreddits' },
      { category: 'trending', suggestions: await this.getSuggestions('trending'), title: 'Diese Subreddits sind heute besonders beliebt' }
    ]
  }

  initialFetch(): void {
    const sub = this.route.snapshot.params.subreddit;
    if (sub) this.fetchSub(sub, 'fill');
    else {
      this.fetchSub('memes');
      this.fetchSub('cats', 'fill');
    }
  }

  async getSuggestions(query: string) {
    const over18 = this.store.userPrefs.over18;
    const res = await this.api.subredditSearch(query, over18).pipe(first()).toPromise();
    console.log(res);
    return res;
  }

  activateFormValidators() {
    this.subredditChooser.valueChanges.pipe(debounceTime(500)).subscribe((chunk: string) => {
      if (chunk === '') {
        this.suggestions = [];
        return this.subredditChooser.setValue('', { emitEvent: false });
      }
      this.subExists = true;
      const over18 = this.store.userPrefs.over18;
      this.api.subredditSearch(chunk, over18).pipe(take(1)).subscribe({
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
    this.userPrefs.valueChanges.subscribe(form => {
      const userPrefs = this.store.userPrefs;
      this.store.saveLS('userPrefs', { volume: userPrefs.volume, over18: form.over18, warn18: form.warn18, warnSpoiler: form.warnSpoiler } );
    });
  }

  fetchSub(sub: string, method = 'silentCaching') {
    if (method !== 'silentCaching') this.loading = true;
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
    const optionsString = options.sort+':'+ [...Object.values(options.params), this.cacheNr].join(':');
    /*
      we are caching redditPosts depending on specific user options
      caching example:
      subreddit: sorted by hot, filtered by day => hot:day:cats ---> RedditPost[] --- notice, we dont differentiate the limits param
      subreddit: sorted by hot, filtered by day => hot:day:memes ---> RedditPost[]
      subredditArr: sorted by hot, filtered by day => hot:day ---> ['cats', 'memes']
    */
    const saved = this.store.getSaved(optionsString+':'+sub), today = new Date().toDateString();
    if (saved?.lastFetch !== today) {
      // important informative console info message:
      console.info('fetching data for /r/'+sub+'...');
      this.err = '';
      let afterId = '';
      if (this.cacheNr > 0) {
        const lastOptionsString = options.sort+':'+ [...Object.values(options.params), this.cacheNr-1].join(':');
        const lastSaved = this.store.getSaved(lastOptionsString+':'+sub).data;
        afterId = lastSaved[lastSaved.length-1].uid;
      }
      this.api.get(sub, options, afterId).pipe(take(1)).subscribe((data: RedditPost[]) => {
        // rich console log info text
        console.log(
          'received: ', data, 'for options: ', options, ' and fetch-method: ' + method,
          afterId.length ? ', after: ' + afterId : '', ', page: ' + this.cacheNr
        );

        if (method !== 'silentCaching') {
          if (method === 'fill') this.posts = data;
          else if (method === 'append') this.posts = this.posts.concat(data);
          this.loading = false;
          this.currentSub = sub;
        }
        this.store.save(optionsString+':'+sub, {data, lastFetch: today});
        const savedArr = this.store.getSaved(sub) || [];
        savedArr.push(optionsString);
        this.store.save(sub, uniq(savedArr));
      }, err => {
        console.info('Error while fetching data from /r/'+sub+': ');
        console.error(err);
        this.loading = false;
        this.currentSub = sub;
        this.err = err.error.reason;
      });
    } else { // do this when there is a cached version of query
      this.loading = false;
      // rich console log info text
      console.log(
        'using saved data: ', saved.data, 'for options: ',options,
        ' and fetch-method: '+method,', page: ' + this.cacheNr
      );

      if (method !== 'silentCaching') {
        if (method === 'fill') this.posts = saved.data;
        else if (method === 'append') this.posts = this.posts.concat(saved.data);
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

  onLeavingOptions(el: HTMLElement, triggerFetch = false) {
    el.classList.remove('fullscreen');
    const touched = this.postOptions.dirty || this.userPrefs.dirty;
    if (touched && triggerFetch) {
      this.fetchSub(this.currentSub, 'fill');
    }
    if (touched) {
      this.postOptions.markAsDirty();
      this.userPrefs.markAsDirty();
    }
  }

  loadMore() {
    this.cacheNr += 1;
    this.fetchSub(this.currentSub, 'append');
  }

  hideOverlay(e: Event, force = false) {
    let el = e.target as HTMLElement;
    if (force) el = document.querySelector('.optionsOverlay') as HTMLElement;
    if (el.classList.contains('optionsOverlay')) {
      this.onLeavingOptions(el, force)
    }
  }
}
