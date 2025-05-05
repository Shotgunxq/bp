import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';
  // initialize to null instead of this.getUserFromStorage()
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    // on startup, hydrate from server if there's a valid cookie
    this.http.get<any>(`${this.baseUrl}/me`, { withCredentials: true }).subscribe(
      user => this.setUserSession(user),
      () => this.clearUserSession()
    );
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials, { withCredentials: true }).pipe(tap(user => this.setUserSession(user)));
  }

  setUserSession(user: any): void {
    this.userSubject.next(user);
  }

  clearUserSession(): void {
    this.userSubject.next(null);
  }

  // still returns something synchronously, just reading the BehaviorSubject
  getUserFromStorage(): any {
    return this.userSubject.value;
  }

  getCurrentUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  getThemes() {
    console.log('Fetching themes...'); // Debug log
    return this.http.get<{ theme_id: number; theme_name: string }[]>(this.baseUrl + '/themes');
  }
  getExercises(queryParams: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl + '/test/api' + queryParams}`);
  }

  createTask(test_id: number, task_id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/tasks`, { test_id, task_id });
  }

  createTest(exercises: number[], cas_na_pisanie: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/tests`, { exercises, cas_na_pisanie });
  }

  // …
  submitTestScore(submissionBody: any): Observable<any> {
    console.log('Submitting payload:', submissionBody);
    return this.http.post<any>(`${this.baseUrl}/submit`, submissionBody);
  }
  // …

  fetchTestData(testId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/test/${testId}`);
  }

  getStatistics(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/statistics/${userId}`);
  }

  getAllScoresForTest(testId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/all-scores/${testId}`);
  }

  getOverallPercentile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/percentile/overall/${userId}`);
  }
}
