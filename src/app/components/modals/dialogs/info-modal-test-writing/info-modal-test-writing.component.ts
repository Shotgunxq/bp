import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-modal-test-writing',
  template: `
    <mat-dialog-content>
      <h2 mat-dialog-title>Informácie k zadávaniu odpovedí:</h2>
      <ul>
        <li>Zadanie odpovede nie je konečné. Počas testu môžeš svoju odpoveď kedykoľvek upraviť alebo zmeniť.</li>
        <li>Pri odpovediach nezáleží na veľkých alebo malých písmenách.</li>
        <li>Po uplynutí časového limitu sa test automaticky odošle.</li>
        <li>Pri zadávaní číselných odpovedí nezáleží na tom, či používaš desatinnú čiarku (,) alebo desatinnú bodku (.).</li>
        <li>Počas testu sa môžeš ľubovoľne prepínať medzi úlohami kliknutím na čísla úloh v hornej časti.</li>
        <li>Úlohy, ktoré už boli zodpovedané, sú zvýraznené žltou farbou.</li>
      </ul>
      <h2 mat-dialog-title>Informácie o gamifikácií:</h2>
      <ul>
        <li>Tvoj cieľ je získať čo najviac bodov.</li>
        <li>Za použitie nápovedy ti budú odpočítané body.</li>
        <li>Za rýchle odpovede získavaš bonusové body.</li>
        <li>Okamžite dostaneš spätnú väzbu pri zadaní odpovede – bublinka s číslom úlohy sa sfarbí na zeleno (správne) alebo červeno (nesprávne).</li>
      </ul>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Zavrieť</button>
    </mat-dialog-actions>
  `,
})
export class InfoModalTestWritingComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoModalTestWritingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
