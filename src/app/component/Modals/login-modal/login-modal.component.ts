import { Component } from '@angular/core';
import { LdapService } from '../../../services/ldap.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
  username: string = '';
  password: string = '';

  constructor(private ldapService: LdapService) {}

  authenticateUser() {
    this.ldapService.authenticate(this.username, this.password)
      .subscribe(
        (response) => {
          // Authentication successful, handle accordingly
          console.log('Authentication successful', response);
        },
        (error) => {
          // Authentication failed, handle accordingly
          console.error('Authentication failed', error);
        }
      );
  }
}
