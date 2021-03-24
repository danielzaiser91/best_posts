import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, first, take } from 'rxjs/operators';

import { StorageService, errHandler, RedditAPIService } from 'app/services';
import { RedditPost, Subreddit } from 'app/types';
import { uniq } from 'app/functions';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';



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
  currentSub: string;
  suggestions: Subreddit[] = [];
  page = 0;
  loading = false;
  err: any;
  cacheCleared = false;

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
      perPage: [opt.limit, Validators.required],
      sort: [opt.sort, Validators.required],
      time: [opt.t, Validators.required],
      query: [opt.q]
    })
    this.userPrefs = formBuilder.group({
      over18: [userPrefs.over18],
      warn18: [userPrefs.warn18],
      warnSpoiler: [userPrefs.warnSpoiler]
    })
  }

  ngOnInit(): void {
    if ('subreddit' in this.route.snapshot.params) this.initialFetch();
    this.activateFormValidators();
  }

  onRecEvent(command: string) {
    switch(command) {
      case 'loadMorePls': return this.loadMore();
      case 'hideSuggestions': return this.suggestions = []
      default: return
    }
  }

  initialFetch(): void {
    const sub = this.route.snapshot.params.subreddit;
    if (sub) this.fetchSub(sub, 'fill');
    else {
      this.fetchSub('memes');
      this.fetchSub('cats', 'fill');
    }
  }

  activateFormValidators() {
    this.subredditChooser.valueChanges.pipe(debounceTime(500)).subscribe((chunk: string) => {
      if (chunk === '') {
        this.suggestions = [];
        return this.subredditChooser.setValue('', { emitEvent: false });
      }
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
    this.userPrefs.valueChanges.subscribe(form => {
      const userPrefs = this.store.userPrefs;
      this.store.saveLS('userPrefs', { volume: userPrefs.volume, over18: form.over18, warn18: form.warn18, warnSpoiler: form.warnSpoiler } );
    });
  }

  fetchSub(sub: string, method = 'silentCaching') {
    if (method !== 'silentCaching') this.loading = true;
    if (!sub) sub = 'popular';
    this.router.navigate(['/r', sub]);
    this.suggestions.length = 0;
    this.err = undefined;

    console.info('fetching data for /r/'+sub+'...');
    (method === 'append' ? this.api.append(sub) : this.api.get(sub)).pipe(take(1), catchError(this.onError)).subscribe({next: (data: RedditPost[]) => {
      console.log('receiving Reddit API Data for: /r/'+sub, data);
      if (method === 'silentCaching') return;
      if (method === 'fill') this.posts = data;
      else if (method === 'append') this.posts = this.posts.concat(data);
      this.loading = false;
      this.currentSub = sub;
    }});
  }

  onError(err: HttpErrorResponse) {
    console.info('Error while fetching data from /r/'+this.currentSub+': ');
    console.error(err);
    this.loading = false;
    err.error.reason ||= err.error.message
    this.err = err;
    return throwError([])
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
    this.fetchSub(this.currentSub, 'append');
  }

  hideOverlay(e: Event, force = false) {
    let el = e.target as HTMLElement;
    if (force) el = document.querySelector('.optionsOverlay') as HTMLElement;
    if (el.classList.contains('optionsOverlay')) {
      this.onLeavingOptions(el, force)
    }
  }
  deleteCache() {
    this.store.db.apiCache.clear();
    this.store.db.comments.clear();
    this.cacheCleared = true;
  }
}
