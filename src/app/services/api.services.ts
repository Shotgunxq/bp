import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.http.get<any>(`${this.baseUrl}/me`, { withCredentials: true }).subscribe({
      next: user => this.setUserSession(user),
      error: err => {
        if (err.status === 401) {
          this.clearUserSession();
        }
      },
    });
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials, { withCredentials: true }).pipe(tap(user => this.setUserSession(user)));
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(tap(() => this.clearUserSession()));
  }

  setUserSession(user: any): void {
    this.userSubject.next(user);
  }

  clearUserSession(): void {
    this.userSubject.next(null);
  }

  getUserFromStorage(): any {
    return this.userSubject.value;
  }
  getCurrentUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  // -- your existing endpoints, all withCredentials --

  getThemes(): Observable<{ theme_id: number; theme_name: string }[]> {
    return this.http.get<{ theme_id: number; theme_name: string }[]>(`${this.baseUrl}/themes`, { withCredentials: true });
  }

  getExercises(queryParams: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/test/api${queryParams}`, { withCredentials: true });
  }

  createTask(test_id: number, task_id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/tasks`, { test_id, task_id }, { withCredentials: true });
  }

  createTest(exercises: number[], cas_na_pisanie: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/tests`, { exercises, cas_na_pisanie }, { withCredentials: true });
  }

  submitTestScore(submissionBody: any): Observable<any> {
    console.log('Submitting payload:', submissionBody);
    return this.http.post<any>(`${this.baseUrl}/submit`, submissionBody, { withCredentials: true });
  }

  fetchTestData(testId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/test/${testId}`, { withCredentials: true });
  }

  getStatistics(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/statistics/${userId}`, { withCredentials: true });
  }

  getAllScoresForTest(testId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/all-scores/${testId}`, { withCredentials: true });
  }

  getOverallPercentile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/percentile/overall/${userId}`, { withCredentials: true });
  }

  fetchCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/me`, { withCredentials: true }).pipe(tap(user => this.setUserSession(user)));
  }
}
