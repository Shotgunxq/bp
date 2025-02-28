import { Component, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from '../../services/apiServices';
import { navbarService } from '../../services/navbarService';
import { AdminExerciseDialogService } from '../../services/adminExerciseDialog.service'; // <-- Import here

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() openExerciseDialogEvent = new EventEmitter<void>(); // NEW event emitter

  username: string | null = '';
  isMenuRoute = false;
  showBackButton = false;
  isAdminRoute = false;

  constructor(
    private navbarService: navbarService,
    private router: Router,
    private apiService: ApiService,
    private adminExerciseDialogService: AdminExerciseDialogService // <-- Inject here
  ) {}

  ngOnInit() {
    const user = this.apiService.getUserFromStorage();
    if (user) {
      this.username = user.givenName;
      this.navbarService.setUsername(this.username!);
    }

    // Subscribe to route changes and filter for NavigationEnd
    this.router.events.pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.isMenuRoute = event.urlAfterRedirects === '/menu';
      this.showBackButton = !this.isMenuRoute; // Show Back button if not on /menu
      console.log('Route:', event.urlAfterRedirects, 'isMenuRoute:', this.isMenuRoute);
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
    });

    // Listen for username updates dynamically
    this.navbarService.currentUsername$.subscribe(name => {
      if (name) {
        this.username = name;
      }
    });
  }

  toggleSidenavMenu() {
    this.toggleSidenav.emit();
  }

  goBack() {
    this.router.navigate(['/menu']); // Always navigate to /menu
  }

  logout() {
    this.apiService.clearUserSession();
    this.navbarService.setUsername('');
    this.router.navigate(['/login']);
  }

  triggerExerciseDialog() {
    // Trigger the dialog via the shared service
    this.adminExerciseDialogService.triggerAdminDialog();
  }
}
