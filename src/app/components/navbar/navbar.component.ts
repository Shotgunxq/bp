// src/app/components/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { navbarService } from '../../services/navbarService';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  username: string | null = '';
  showTypewriter = false;  // Trigger for the animation

  constructor(private navbarService: navbarService) {}

  ngOnInit() {
    this.navbarService.currentUsername$.subscribe((name) => {
      if (name) {
        this.username = name;
        this.showTypewriter = true;  // Trigger animation on username change
      }
    });
  }
}
