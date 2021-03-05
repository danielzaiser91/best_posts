import { Component, Input, OnInit, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortNumber' })
export class ShortNumberPipe implements PipeTransform {
  transform(number: number): string {
    return ''+(number > 1000 ? Math.floor(number/1000) + 'k' : number);
  }
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass']
})
export class GalleryComponent {
  @Input() posts: any;

  constructor() { }

  toFullscreen(e: any) {
    const target = e.target, li = target.closest('li'), aud = li.querySelector('audio'),
      img = li.querySelector('img'), vid = li.querySelector('video'), isVid = !!vid;
    if(li.classList.contains('fullscreen')) {
      if(target.classList.contains('exit')) {
        if(isVid) { aud.pause(); vid.pause(); }
        li.classList.remove('fullscreen');
      }
    } else {
      isVid ? vid.controls = true : img.src = img.getAttribute('data-src')
      li.classList.add('fullscreen');
    }
  }

  videoControl(vid: any, control: string) {
    control == 'pause' ? vid.nextSibling.pause() : vid.nextSibling.play();
  }
}
