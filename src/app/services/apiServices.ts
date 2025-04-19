import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; // Base URL of your Express backend
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  setUserSession(user: any): void {
    console.log('Saving user to localStorage:', user);
    sessionStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user); // Notify observers of the new user
  }

  // Clear the user session
  clearUserSession(): void {
    console.log('Clearing user session');
    sessionStorage.removeItem('user');
    this.userSubject.next(null); // Notify observers of the logout
  }

  // Retrieve the user data from localStorage
  getUserFromStorage(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Observable to get the current user
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
