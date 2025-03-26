import { Component } from '@angular/core';

@Component({
  selector: 'app-time-up-dialog',
  template: `
    <h1 mat-dialog-title>Time is Up!</h1>
    <div mat-dialog-content>
      <p>Your time is up. The test has ended.</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">OK</button>
    </div>
  `,
})
export class TimeUpDialogComponent {}
