// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class navbarService {
  private usernameSource = new BehaviorSubject<string | null>(null);
  currentUsername$ = this.usernameSource.asObservable();

  setUsername(username: string) {
    this.usernameSource.next(username);
  }
}
