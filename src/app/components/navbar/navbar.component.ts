import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from '../../services/api.services';
import { navbarService } from '../../services/helper/navbar.helper';
import { AdminExerciseDialogService } from '../../services/adminExerciseDialog.service';
import { AdminNewExerciseComponent } from '../../pages/admin-page/adminDialog/admin-new-exercise/admin-new-exercise.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() openExerciseDialogEvent = new EventEmitter<void>();

  username: string | null = '';
  isMenuRoute = false;
  showBackButton = false;
  isAdminRoute = false;
  isStatisticsPage = false;
  isAdmin = false;
  showNavbar = true;

  constructor(
    private navbarService: navbarService,
    private router: Router,
    private apiService: ApiService,
    private adminExerciseDialogService: AdminExerciseDialogService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Instead of grabbing the user just once here, move user checks into the route subscriber:
    this.router.events.pipe(filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((nav: NavigationEnd) => {
      const url = nav.urlAfterRedirects;

      // 1) Hide navbar on login:
      this.showNavbar = url !== '/login' && url !== '/';

      // 2) Re-read user from storage on every navigation end:
      const user = this.apiService.getUserFromStorage();
      if (user) {
        this.username = user.givenName;
        this.isAdmin = user.role === 'admin';
        this.navbarService.setUsername(this.username ?? '');
      } else {
        this.username = '';
        this.isAdmin = false;
      }

      // 3) Update “which page am I on?” flags:
      this.isMenuRoute = url === '/menu';
      this.showBackButton = !this.isMenuRoute;
      this.isAdminRoute = url.startsWith('/admin');
      this.isStatisticsPage = url === '/admin/statistics';
    });
  }

  goBack() {
    if (this.router.url === '/admin/statistics') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/menu']);
    }
  }

  logout() {
    this.apiService.clearUserSession();
    this.navbarService.setUsername('');
    this.router.navigate(['/login']);
  }

  triggerExerciseDialog() {
    // this.adminExerciseDialogService.triggerAdminDialog();

    this.dialog.open(AdminNewExerciseComponent, {
      width: '600px',
    });
  }
}
