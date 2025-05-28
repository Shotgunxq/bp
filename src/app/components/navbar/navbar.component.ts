import { Component, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from '../../services/api.services';
import { navbarService } from '../../services/helper/navbar.helper';
import { AdminExerciseDialogService } from '../../services/adminExerciseDialog.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Output() openExerciseDialogEvent = new EventEmitter<void>();

  username: string | null = '';
  isMenuRoute = false;
  showBackButton = false;
  isAdminRoute = false;
  isStatisticsPage: boolean = false;
  isAdmin = false; // Flag to track admin user (anyone not a student)

  constructor(
    private navbarService: navbarService,
    private router: Router,
    private apiService: ApiService,
    private adminExerciseDialogService: AdminExerciseDialogService
  ) {}

  ngOnInit() {
    const user = this.apiService.getUserFromStorage();
    if (user) {
      this.username = user.givenName;
      // Grant admin rights to anyone whose employeeType is not 'student'
      this.isAdmin = user.employeeType !== 'student';
      this.navbarService.setUsername(this.username!);
    }

    // Subscribe to route changes and filter for NavigationEnd events
    this.router.events.pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.isMenuRoute = event.urlAfterRedirects === '/menu';
      this.showBackButton = !this.isMenuRoute; // Show Back button if not on /menu
      console.log('Route:', event.urlAfterRedirects, 'isMenuRoute:', this.isMenuRoute);
      // isAdminRoute is set based on the current URL starting with '/admin'
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
    });

    // Listen for username updates dynamically
    this.navbarService.currentUsername$.subscribe(name => {
      if (name) {
        this.username = name;
      }
    });

    // Subscribe to router events to determine if the current page is the statistics page
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.isStatisticsPage = event.urlAfterRedirects === '/admin/statistics';
    });
  }

  goBack() {
    if (this.router.url === '/admin/statistics') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/menu']); // Always navigate to /menu
    }
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
