import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; // Base URL of your Express backend

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
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

  submitTestScore(userId: number, testId: number, points: number): Observable<any> {
    const body = {
      user_id: userId,
      test_id: testId,
      points: points,
      timestamp: new Date().toISOString(),
    };
    return this.http.post(`${this.baseUrl}/submit`, body);
  }

  fetchTestData(testId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/test/${testId}`);
  }
}
