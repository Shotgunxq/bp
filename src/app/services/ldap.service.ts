import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LdapService {
  private ldapUrl = 'ldap.stuba.sk';

  constructor(private http: HttpClient) {}

  authenticate(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      username: username,
      password: password
    };

    return this.http.post<any>(this.ldapUrl, body, { headers: headers });
  }
}
