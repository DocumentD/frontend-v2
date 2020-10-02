import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private title: Title
  ) {}

  register(appName: string) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activeRoute),
        map((route) => route.firstChild),
        switchMap((route) => route.data),
        map((data) => {
          return data && data.title ? `${data.title} • ${appName}` : appName;
        })
      )
      .subscribe((currentTitle) => this.title.setTitle(currentTitle));
  }
}
