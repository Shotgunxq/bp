import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class adminService {
  private baseUrl = 'http://localhost:3000'; // Base URL of your Express backend

  constructor(private http: HttpClient) {}

  getAllExercisesByTheme(themeId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/themes/${themeId}/exercises`);
  }
}
