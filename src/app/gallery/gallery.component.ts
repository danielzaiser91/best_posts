import { Component, HostListener, Input, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortNumber' })
export class ShortNumberPipe implements PipeTransform {
  transform(number: number): string {
    return (() => {if (number > 1000000) {
      return Math.floor(number/1000/1000) + 'm'
    } else if (number > 1000) {
      return Math.floor(number/1000) + 'k'
    } else {
      return number+''
    }})()
  }
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass']
})
export class GalleryComponent {
  @Input() posts: any;
  controls = false;

  constructor() { }

  onItemClick(e: any) {
    const target = e.target, li = target.closest('li'), aud = li.querySelector('audio') || {},
      imgs = li.querySelectorAll('img'), vid = li.querySelector('video');
    if(li.classList.contains('fullscreen')) {
      if(target.classList.contains('exit')) {
        if(vid && !li.classList.contains('no-audio')) { aud.pause(); }
        if(vid) { vid.pause(); }
        li.classList.remove('fullscreen');
        imgs.forEach((img: HTMLImageElement) => {
          img.style.transform = "";
        });
      }
    } else {
      li.classList.add('fullscreen');
      if (li.classList.contains('video')) vid.controls = true; 
      if(vid) vid.play();
      else if(li.classList.contains('youtube')) {
        if(!li.classList.contains('has-played')) li.querySelector('iframe').src = li.querySelector('iframe').getAttribute('data-src');
        li.classList.add('has-played');
      } else {
        Array.from(imgs).forEach((img: any) => {
          img.onloadstart = () => { // todo: show loader when image is being replaced / lazy loaded
            console.log('yep');
          }
          const lazy = img.getAttribute('data-src');
          if(lazy) img.src = lazy;
        });
      }
    }
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
    if(!gallery) return;
    const imgs = gallery.querySelectorAll('img');
    const max = imgs.length - 1;
    const style = imgs.item(0).style.transform.match(/(?<=translateX\([-]).*(?=%\))/);
    const i = Math.floor(Number((style?.[0] || 0))/100);
    if(dir === 'links') {
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
  @HostListener('document:keydown', ['$event']) onKeydownHandler($event: KeyboardEvent) {
    const gallery = document.querySelector('.fullscreen .gallery-container') as HTMLDivElement;
    if ($event.key === 'ArrowRight') {
      this.onRight(gallery)
    } else if ($event.key === 'ArrowLeft') {
      this.onLeft(gallery)
    } else if ($event.key === 'Escape') {
      document.querySelector('.fullscreen')?.classList.remove('fullscreen');
    }
  }

  log(e:any) {console.log(e)}
}
