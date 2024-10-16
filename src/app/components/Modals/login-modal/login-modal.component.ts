// import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  // Import Router
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LoginModalComponent {
  username: string = '';  // Bound to the username input
  password: string = '';  // Bound to the password input
  errorMessage: string = '';  // To show error messages if login fails
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  constructor(private http: HttpClient, private router: Router) {}  // Inject Router

  //TODO: include apiService

  login() {
    // Send login request to the server
    const credentials = { username: this.username, password: this.password };

    this.http.post('http://localhost:3000/login', credentials).subscribe(
      (response) => {
        console.log('Login successful:', response);
        // Navigate to the menu page on successful login
        this.router.navigate(['/menu']);
      },
      (error) => {
        console.error('Login failed:', error);
        // Show error message to the user
        this.errorMessage = 'Invalid username or password. Please try again.';
      }
    );
  }
}
