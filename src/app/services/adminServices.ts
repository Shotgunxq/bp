import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAllExercisesByTheme(themeId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/themes/${themeId}/exercises`);
  }

  deleteExercise(exerciseId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/exercises/${exerciseId}`);
  }

  updateExercise(exercise: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/exercises/${exercise.id}`, exercise);
  }
}
