import { Component } from '@angular/core';

@Component({
  selector: 'app-time-up-dialog',
  template: `
    <h1 mat-dialog-title>Čas vypršal!</h1>
    <div mat-dialog-content>
      <p>Váš čas sa skončil. Test bol ukončený a poslaný.</p>
    </div>
    <div mat-dialog-actions style="justify-content: center;">
      <button mat-button [mat-dialog-close]="true">OK</button>
    </div>
  `,
})
export class TimeUpDialogComponent {}
