import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-modal-test-creation',
  template: `
    <mat-dialog-content>
      <h2 mat-dialog-title>Informácie k zadávaniu odpovedí:</h2>
      Po zapnutí gamifikácie dostávaš okamžitú spätnú väzbu o správnosti odpovede a zbieraš body za správne vyriešené úlohy. K dispozícii máš aj
      nápovedy, ktoré ti pomôžu zvládnuť náročnejšie úlohy a učiť sa efektívnejšie.
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Zavrieť</button>
    </mat-dialog-actions>
  `,
})
export class InfoModalTestCreationComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoModalTestCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
