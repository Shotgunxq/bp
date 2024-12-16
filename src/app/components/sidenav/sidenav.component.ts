import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('slideMenu', [
      state(
        'closed',
        style({
          transform: 'translateX(100%)', // Slide out to the right
          opacity: 0,
        })
      ),
      state(
        'open',
        style({
          transform: 'translateX(0)', // Fully visible
          opacity: 1,
        })
      ),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ]),
  ],
})
export class SidenavComponent {
  isOpen = false;

  toggleSidenav() {
    this.isOpen = !this.isOpen;
  }

  closeSidenav() {
    this.isOpen = false;
  }
}
