import { Component, HostListener, Input } from '@angular/core';
import { RedditPost } from 'app/types';
import { StorageService } from '../services';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass']
})
export class GalleryComponent {
  @Input() posts: any[];
  controls = false;
  localPref = 1;
  currentVolume = 0;

  constructor(private store: StorageService) { }

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
    li.classList.remove('fullscreen', 'enlarge');
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
      }
    } else { this.openFullscreen(li); }
  }

  onPlay(vid: HTMLVideoElement) {
    if (vid.closest('li')?.classList.contains('no-audio')) return;
    const aud = (vid.nextSibling as HTMLAudioElement);
    aud.currentTime = vid.currentTime;
    aud.play()
  }

  onPause(vid: HTMLVideoElement) {
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
    const lis = li.parentElement!.children as HTMLCollectionOf<HTMLLIElement>, index = Array.from(lis).indexOf(li), next = lis.item(index + dir);
    this.closeFullscreen(li);
    this.openFullscreen(next ? next : lis.item(0)!)
  }

  @HostListener('window:keyup', ['$event']) function($event: KeyboardEvent) {
    const gallery = document.querySelector('.fullscreen.gallery .content-wrapper') as HTMLDivElement,
      li = document.querySelector('.fullscreen') as HTMLLIElement;
    if ($event.key === 'ArrowRight') this.onRight(gallery);
    else if ($event.key === 'ArrowLeft') this.onLeft(gallery);
    else if ($event.key === 'ArrowUp') this.nextPost(li, 1);
    else if ($event.key === 'ArrowDown') this.nextPost(li, -1);
    else if ($event.key === 'Escape') this.closeFullscreen(li);
  }
}
