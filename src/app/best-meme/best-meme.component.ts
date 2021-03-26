import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, first, take } from 'rxjs/operators';

import { StorageService, errHandler, RedditAPIService } from 'app/services';
import { RedditPost, Subreddit } from 'app/types';
import { isRobot, uniq } from 'app/functions';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { popular } from 'app/static/popular';
import { environment } from 'environments/environment';


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
  isRobot = false;
  showRec = false;
  copy: any;

  constructor(
    private api: RedditAPIService,
    formBuilder: FormBuilder,
    public store: StorageService,
    private route: ActivatedRoute,
    private router: Router)
  {
    this.isRobot = environment.isRobot;
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
    if (!this.isRobot) this.initialFetch();
    else { this.posts = popular; this.currentSub = 'popular'}
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
    const sub = this.route.snapshot.params.subreddit
    if (sub) this.fetchSub(sub, 'fill');
    else {
      this.showRec = true;
      this.fetchSub('popular', 'fill', true);
    }
  }

  activateFormValidators() {
    this.subredditChooser.valueChanges.pipe(debounceTime(300)).subscribe((chunk: string) => {
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

  fetchSub(sub: string, method = 'silentCaching', noRoute = false) {
    if (method !== 'silentCaching') this.loading = true;
    let exclude = this.store.userOptions.exclude;
    if (!noRoute) this.router.navigate(['/r', sub]);
    this.suggestions.length = 0;
    this.err = undefined;
    this.currentSub = sub;

    console.info('fetching data for /r/'+sub+'...', method);
    (method === 'append' ? this.api.append(sub) : this.api.get(sub, { exclude })).pipe(take(1), catchError(err => this.onError(err))).subscribe({next: (data: RedditPost[]) => {
      console.log('receiving Reddit API Data for: /r/'+sub, data, exclude);
      if (method === 'silentCaching') return;
      if (method === 'fill') this.posts = data;
      else if (method === 'append') this.posts = this.posts.concat(data);
      this.loading = false;
    }});
  }

  onError(err: HttpErrorResponse) {
    console.info('%cError while fetching data from /r/'+this.currentSub+': ','color:black;font-size:2em;background-color:white;border:1px solid;');
    console.error(err);
    if (err && err.error) {
      err.error.reason ||= err.error.message;
      this.err = Object.assign({}, err);
    }
    return of([]);
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
