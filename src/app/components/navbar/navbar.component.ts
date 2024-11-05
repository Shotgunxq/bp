import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { navbarService } from '../../services/navbarService';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  username: string | null = '';
  showTypewriter = false;  
  isMenuRoute = false; 

  constructor(private navbarService: navbarService, private router: Router) {}

  ngOnInit() {
    // Subscribe to route changes to update navbar
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isMenuRoute = event.urlAfterRedirects === '/menu';
      });

    // Subscribe to username changes for typewriter effect
    this.navbarService.currentUsername$.subscribe((name) => {
      if (name) {
        this.username = name;
        this.showTypewriter = true;  
      }
    });
  }
    navigateToMenu() {
    this.router.navigate(['/menu']);
  }
}
