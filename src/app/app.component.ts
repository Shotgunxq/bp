import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slideMenu', [
      state('closed', style({ width: '0px', opacity: 0 })),
      state('open', style({ width: '250px', opacity: 1 })),
      transition('closed <=> open', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  showNavbar = true;
  isOpen = false; // Controls the sidenav state

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.showNavbar = event.urlAfterRedirects !== '/';
    });
  }
}
