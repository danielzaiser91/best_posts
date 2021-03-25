import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { MonoTypeOperatorFunction, Observable, OperatorFunction } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { googleData } from './googleData'

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.sass']
})
export class HeadComponent implements OnInit {
  navStart: Observable<NavigationEnd>;

  constructor(private sanitizer: DomSanitizer, router: Router) {
    this.navStart = router.events.pipe(
      filter(evt => evt instanceof NavigationEnd) as OperatorFunction<any, any>,
      distinctUntilChanged((p: NavigationEnd, q: NavigationEnd) => p.url === q.url)
      ) as Observable<NavigationEnd>;
  }

  ngOnInit(): void {
    this.executeJS(googleData);
    this.navStart.subscribe(this.onNavEnd);
  }

  onNavEnd(evt: NavigationEnd) {
    // change title
    const title = document.querySelector('title') as HTMLTitleElement;
    title.textContent = 'Best of Reddit' + (evt.url !== '/' ? ' '+evt.url : '');
    console.log('navEnd', evt.url)
  }

  executeJS(data: string) {
    const script = document.createElement('script');
    script.innerHTML = data;
    script.type="application/ld+json";
    script.async = false;
    document.head.appendChild(script);
  }
}
