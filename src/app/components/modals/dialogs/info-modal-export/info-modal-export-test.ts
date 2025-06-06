import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-modal-export-test',
  template: `
    <mat-dialog-content>
      <h2 mat-dialog-title>Informácie o generovaní úloh do PDF</h2>
      <p>Funkcia generovania úloh do PDF funguje rovnako ako pri preskúšaní v aplikácii.</p>
      <p>Najskôr si vyberte počet úloh podľa obtiažnosti (ľahké, stredné, ťažké) a zvoľte jednu alebo viac tém, ktorým sa majú úlohy venovať.</p>
      <p>
        Po kliknutí na tlačidlo
        <strong>„Generovať úlohy do PDF“</strong>
        sa vytvorí PDF dokument, ktorý si môžete stiahnuť a vytlačiť.
      </p>
      <p>
        Takto si môžete precvičiť svoje vedomosti aj mimo aplikácie — napríklad
        <strong>offline alebo na papieri</strong>
        , čo je vhodné na samostatné štúdium či overenie vedomostí klasickým spôsobom.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Zavrieť</button>
    </mat-dialog-actions>
  `,
})
export class InfoModalExportTestComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoModalExportTestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
