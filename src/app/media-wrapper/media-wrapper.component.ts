import { AfterViewInit, Component, ComponentFactoryResolver, ContentChildren, Input, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { RedditPost } from 'app/types';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IframeComponent } from './iframe/iframe.component';
import { ImageComponent } from './image/image.component';
import { MediaDirective } from './media.directive'
import { TextComponent } from './text/text.component';
import { VideoComponent } from './video/video.component';

@Component({
  selector: 'app-media-wrapper',
  templateUrl: './media-wrapper.component.html',
  styleUrls: ['./media-wrapper.component.sass']
})
export class MediaWrapperComponent implements OnInit, AfterViewInit {
  @Input() post: RedditPost;
  @ViewChild(MediaDirective, { static: true }) mediaHost: MediaDirective;
  listener: Subscription;

  constructor(private factory: ComponentFactoryResolver) { }

  ngOnInit() {
    const mediaComponent: typeof VideoComponent | typeof TextComponent | typeof IframeComponent | typeof ImageComponent = ({
      'video': VideoComponent,
      'gifv': VideoComponent,
      'gallery': ImageComponent,
      'youtube': IframeComponent,
      'vimeo': IframeComponent,
      'discussion': TextComponent
    } as {[key: string]: any})[this.post.is] ?? ImageComponent; // specify all different components
    const compFactory = this.factory.resolveComponentFactory(mediaComponent);
    const viewRef = this.mediaHost.viewContainerRef.createComponent(compFactory)
    viewRef.instance.post = this.post;
  }

  ngAfterViewInit() {
    // possible to specify
    if (true && this.post.is === 'image') this.initLazy()
  }

  initLazy() {
    this.listener = fromEvent(window, 'scroll').pipe(
      debounceTime(800)
    ).subscribe((event) => this.lazyLoad());
    this.lazyLoad();
  }

  lazyLoad() {
    const parent = this.mediaHost.viewContainerRef.element.nativeElement.parentElement.parentElement;
    const mediaArr = [...this.mediaHost.viewContainerRef.element.nativeElement.previousElementSibling.children];
    parent.offsetTop / parent.offsetHeight;
    const windowAtIndex = Math.floor(window.scrollY / parent.offsetHeight);
    const mediaAtIndex = Math.floor(parent.offsetTop / parent.offsetHeight);
    
    // only load view + next and previous 4 media files
    const isInRange = windowAtIndex+4 > mediaAtIndex && mediaAtIndex > windowAtIndex-4;
    if (isInRange) {
      this.listener.unsubscribe();
      mediaArr.forEach((media: HTMLImageElement) => {
        const lazy = media.getAttribute('data-src')
        if (lazy) {
          parent.classList.add('loading');
          const newImg = new Image();
          newImg.src = lazy;
          newImg.onload = _ => {
            media.src = lazy;
            parent.classList.remove('loading');
            newImg.remove();
          };
          newImg.onerror = _ => parent.classList.add('error');
        }
        console.log('lazy-loaded')
      });
    }
  }
}
