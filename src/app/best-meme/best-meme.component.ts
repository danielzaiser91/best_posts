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
  posts: RedditPost[] = [];
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
    this.store.fetchMetaData();
    this.activateFormValidators();
  }

  activateFormValidators() {
    // listen on input 10 times per second
    this.subredditChooser.get('subreddit')?.valueChanges.pipe(debounceTime(100)).subscribe((chunk: string) => {
      this.subExists = true;
      if (chunk === '') { this.suggestions = []; return; }
      this.store.reddit.transaction('r', this.store.reddit.meta, () => {
        return this.store.reddit.meta.where('name').startsWithIgnoreCase(chunk).reverse().sortBy('subscribers');
      }).then(suggestions => this.suggestions = suggestions.sort((a, _) => a.name?.toLowerCase() === chunk.toLowerCase() ? -1 : 1) as Subreddit[]);
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

  fetchSub(sub: string, base = false) {
    if (this.posts.length && this.currentSub === sub) return;
    if (base) this.loading = true;
    this.suggestions.length = 0;
    if (this.subredditInput) this.subredditInput.nativeElement.value = sub;
    const saved = this.store.getSaved(sub), today = new Date().toDateString();
    if (saved?.lastFetch !== today) {
      console.info('fetching data for /r/'+sub+'...');
      this.api.get(sub).pipe(take(1)).subscribe((data: RedditPost[]) => {
        if (base) {
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
      if (base) {
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

  hideOverlay(e: any) { if (e.target.classList.contains('optionsOverlay')) e.target.classList.remove('fullscreen') }
}
