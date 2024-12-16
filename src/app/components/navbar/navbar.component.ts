import { Component, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from '../../services/apiServices';
import { navbarService } from '../../services/navbarService';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Output() sidenavToggled = new EventEmitter<void>();

  username: string | null = '';
  isMenuRoute = false;

  constructor(
    private navbarService: navbarService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const user = this.apiService.getUserFromStorage();
    if (user) {
      this.username = user.givenName;
      this.navbarService.setUsername(this.username || '');
    }

    this.router.events.pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.isMenuRoute = event.urlAfterRedirects === '/menu';
    });

    this.navbarService.currentUsername$.subscribe(name => {
      if (name) {
        this.username = name;
      }
    });
  }

  toggleSidenav() {
    this.sidenavToggled.emit(); // Notify parent component to toggle sidenav
  }

  logout() {
    this.apiService.clearUserSession();
    this.navbarService.setUsername('');
    this.router.navigate(['/login']);
  }
}
