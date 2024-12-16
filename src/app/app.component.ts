import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showNavbar = true;
  opened = false; // Controls the sidenav state

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.showNavbar = event.urlAfterRedirects !== '/';
    });
  }
}
