import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { navbarService } from '../../services/navbarService';
import { filter } from 'rxjs/operators';
import { ApiService } from '../../services/apiServices';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();

  username: string | null = '';
  showTypewriter = false;
  isMenuRoute = false;

  constructor(
    private navbarService: navbarService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const user = this.apiService.getUserFromStorage();
    if (user) {
      this.username = `${user.givenName}`;
      console.log('User found in storage:', this.username);
      this.navbarService.setUsername(this.username);
    }

    // Watch for route changes
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.isMenuRoute = event.urlAfterRedirects === '/menu';
    });

    // Listen for username changes dynamically
    this.navbarService.currentUsername$.subscribe(name => {
      if (name) {
        this.username = name;
      }
    });
  }
  navigateToMenu() {
    this.router.navigate(['/menu']);
  }

  logout() {
    this.apiService.clearUserSession();
    this.navbarService.setUsername(''); // Clear navbar username
    this.router.navigate(['/login']); // Redirect to login
  }
}
