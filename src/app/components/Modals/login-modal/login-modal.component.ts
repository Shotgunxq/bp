import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ApiService } from '../../../services/api.services';
import { navbarService } from '../../../services/helper/navbar.helper';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LoginModalComponent {
  username: string = ''; // Bound to the username input
  password: string = ''; // Bound to the password input
  errorMessage: string = ''; // To show error messages if login fails
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private navbarService: navbarService,
    private cd: ChangeDetectorRef
  ) {}

  login() {
    const credentials = { username: this.username, password: this.password };
    this.apiService.login(credentials).subscribe(
      response => {
        console.log(response.givenName);
        this.navbarService.setUsername(response.givenName);
        this.apiService.setUserSession(response);
        // this.navbarService.setUsername(`${response.givenName} ${response.lastName}`);

        this.router.navigate(['/menu']);
      },
      error => {
        console.error(error);
        this.errorMessage = 'Invalid username or password';
        this.cd.markForCheck();
      }
    );
  }
}
