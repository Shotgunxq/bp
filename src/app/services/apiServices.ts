import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; // Base URL of your Express backend

  constructor(private http: HttpClient) {}

  getExercises(queryParams: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl + '/test/api' + queryParams}`);
  }

  createTask(test_id: number, task_id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/tasks`, { test_id, task_id });
  }

  createTest(tasks_id: number[], cas_na_pisanie: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/tests`, { tasks_id, cas_na_pisanie });
  }
}
