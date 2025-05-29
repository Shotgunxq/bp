// admin-dialog.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminExerciseDialogService {
  private adminDialogTriggerSubject = new Subject<void>();
  adminDialogTriggered$ = this.adminDialogTriggerSubject.asObservable();

  triggerAdminDialog() {
    this.adminDialogTriggerSubject.next();
  }
}
