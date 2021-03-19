import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { take } from 'rxjs/operators';

import { deepEquals } from 'app/functions';
import { RedditComment, RedditPost } from 'app/types';
import { RedditAPIService, StorageService } from 'app/services';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass']
})
export class GalleryComponent {
  @Input() posts: any[];
  @Output() loadMorePls = new EventEmitter();
  controls = false;
  localPref = 1;
  currentVolume = 0;
  lastY = 0;
  lastX = 0;
  comments: RedditComment[] = [];
  commentsForPost = '';

  constructor(private store: StorageService, private api: RedditAPIService) { }

  closeFullscreen(li: HTMLLIElement) {
    if (!li) return;
    const aud = li.querySelector('audio')  as HTMLAudioElement, vid = li.querySelector('video') as HTMLVideoElement,
      imgs = li.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    if (aud) {
      aud.pause();
      this.store.preferences({ volume: aud.volume });
    }
    if (vid) {
      vid.pause();
      vid.controls = false;
    }
    li.classList.remove('fullscreen', 'enlarge', 'show-comments');
    imgs.forEach(img => img.style.transform = "");
  }

  openFullscreen(li: HTMLLIElement) {
    const iframe = li.querySelector('iframe'), text = li.querySelector('.text') as HTMLDivElement, aud = li.querySelector('audio') as HTMLAudioElement,
      imgs = li.querySelectorAll('img') as NodeListOf<HTMLImageElement>, vid = li.querySelector('video') as HTMLVideoElement;
    li.classList.add('fullscreen');
    text.classList.remove('max-limit');
    if (vid) { // videos & gifv
      if (aud) {
        const pref = this.store.userPrefs.volume;
        this.changeVolume(pref, li);
      }
      vid.controls = true;
      vid.play();
    } else if (iframe) { // youtube & vimeo
      if (!li.classList.contains('has-played') && iframe) iframe.src = iframe.getAttribute('data-src') || '';
      li.classList.add('has-played');
    } else if (imgs.length) { // images & gallery
      imgs.forEach(img => {
        const lazy = img.getAttribute('data-src');
        if (lazy) {
          li.classList.add('loading');
          const newImg = new Image();
          newImg.src = lazy;
          newImg.onload = _ => {
            img.src = lazy;
            li.classList.remove('loading');
            newImg.remove();
          };
          newImg.onerror = _ => li.classList.add('error');
        }
      });
    }
  }

  share(post: RedditPost) {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: post.thread_url.target
      })
    }
  }

  onLiClick(li: HTMLLIElement, event?: MouseEvent | TouchEvent) {
    const el = (event!.target as HTMLElement), pref = this.localPref;
    if (li.classList.contains('fullscreen')) {
      if (el.classList.contains('exit')) {
        this.closeFullscreen(li);
      } else if (el.classList.contains('up')) {
        this.changeVolume((this.currentVolume === 1 ? pref : 1), li);
      } else if (el.classList.contains('down')) {
        this.changeVolume((this.currentVolume === 0 ? pref : 0), li);
      } else if (el.classList.contains('content-wrapper')) {
        const vid = el.querySelector('video');
        if (vid) {
          vid.classList.contains('playing') ? vid.pause() : vid.play();
        }
      }
    } else { this.openFullscreen(li); }
  }

  loadMore() {
    this.loadMorePls.emit()
  }

  onPlay(vid: HTMLVideoElement) {
    vid.classList.add('playing');
    if (vid.closest('li')?.classList.contains('no-audio')) return;
    const aud = (vid.nextSibling as HTMLAudioElement);
    aud.currentTime = vid.currentTime;
    aud.play()
  }

  onPause(vid: HTMLVideoElement) {
    vid.classList.remove('playing');
    if (!vid.closest('li')?.classList.contains('no-audio')) (vid.nextSibling as HTMLAudioElement).pause()
  }

  changeVolume(vol: number, li: HTMLLIElement) {
    const aud = li.querySelector('audio');
    if (!aud) return;
    if (vol > 0 && vol < 1) this.localPref = vol;
    const slider = li.querySelector('.volume input') as HTMLInputElement;
    aud.volume = vol;
    slider.value = ''+vol;
    this.currentVolume = vol;
  }

  onLeft(gallery: HTMLDivElement | null) {
    this.galleryDir(gallery, 'links')
  }

  onRight(gallery: HTMLDivElement | null) {
    this.galleryDir(gallery, 'rechts')
  }

  onNoAudio(el: HTMLLIElement, err: ErrorEvent) {
    el.classList.add('no-audio');
    return true;
  }

  galleryDir(gallery: HTMLDivElement | null, dir: string) {
    if (!gallery) return;
    const imgs = gallery.querySelectorAll('img');
    const max = imgs.length - 1;
    const style = imgs.item(0).style.transform.match(/(?<=translateX\([-]).*(?=%\))/);
    const i = Math.floor(Number((style?.[0] || 0))/100);
    if (dir === 'links') {
      if (i<max) {
        imgs.forEach(v=>v.style.transform = "translateX(-"+ (100*(i+1)) +"%)");
      } else {
        imgs.forEach(v=>v.style.transform = "translateX(0%)");
      }
    } else {
      if (i-1<0) {
        imgs.forEach(v=>v.style.transform = "translateX(-"+ (100*max) +"%)");
      } else {
        imgs.forEach(v=>v.style.transform = "translateX(-"+ (100*(i-1)) +"%)");
      }
    }
  }

  nextPost(li: HTMLLIElement, dir: number) {
    if (!li) return;
    const lis = li.parentElement!.children as HTMLCollectionOf<HTMLLIElement>,
          index = Array.from(lis).indexOf(li), next = lis.item(index + dir) ?? (dir === -1 ? lis.item(lis.length-1) : lis.item(0));
    this.closeFullscreen(li);
    this.openFullscreen(next!);
  }

  touch(method: string, ev: TouchEvent) {
    const li = document.querySelector('.fullscreen') as HTMLLIElement;
    if (!li || !ev.changedTouches || ev.targetTouches.length > 1) return;

    const y = ev.changedTouches[0].clientY, x = ev.changedTouches[0].clientX;
    if (method === 'start') {
      this.lastY = y;
      this.lastX = x;
    }
    else {
      const swipeDirY = this.lastY < y ? -1 : 1, swipeDirX = this.lastX < x ? 1 : 0,
            userIntention = (Math.abs(this.lastY - y) > Math.abs(this.lastX - x)) ? 'y' : 'x',
            gallery = li.classList.contains('gallery') && li.querySelector('.content-wrapper') as HTMLDivElement;
      if (userIntention === 'y') this.nextPost(li, swipeDirY);
      else if (userIntention === 'x' && gallery) swipeDirX ? this.onRight(gallery) : this.onLeft(gallery);
    }
  }

  async loadComments(sub: string, id: string, ev: Event) {
    const li = document.querySelector('li.fullscreen') as HTMLLIElement;
    this.commentsForPost = id;
    li.classList.add('loading-comments');
    ev.stopPropagation();
    li.classList.toggle('show-comments');
    const cached = await this.store.db.comments.where({'subreddit': sub, 'post_id': id}).toArray();
    if (cached.length) {
      li.classList.remove('loading-comments');
      if (deepEquals(cached,this.comments)) return;
      this.comments = cached;
      console.log('loading comments from Cache:', cached);
    } else {
      this.api.getComments(sub, id).pipe(take(1)).subscribe(comments => {
        li.classList.remove('loading-comments');
        this.comments = comments;
        this.store.db.comments.bulkPut(comments);
        console.log('loading comments from API:', comments);
      }, err => li.classList.remove('loading-comments'));
    }
  }

  @HostListener('window:keyup', ['$event']) function($event: KeyboardEvent) {
    const gallery = document.querySelector('.fullscreen.gallery .content-wrapper') as HTMLDivElement,
      li = document.querySelector('.fullscreen') as HTMLLIElement;
    if ($event.key === 'ArrowRight') this.onRight(gallery);
    else if ($event.key === 'ArrowLeft') this.onLeft(gallery);
    else if ($event.key === 'ArrowUp') this.nextPost(li, -1);
    else if ($event.key === 'ArrowDown') this.nextPost(li, 1);
    else if ($event.key === 'Escape') this.closeFullscreen(li);
  }
}
