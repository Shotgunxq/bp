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
    // Ensure you pass the correct id (exercise_id)
    return this.http.delete<any>(`${this.baseUrl}/exercises/${exerciseId}`);
  }

  updateExercise(exercise: any): Observable<any> {
    // Use exercise.exercise_id when updating
    return this.http.put<any>(`${this.baseUrl}/exercises/${exercise.exercise_id}`, exercise);
  }
}
