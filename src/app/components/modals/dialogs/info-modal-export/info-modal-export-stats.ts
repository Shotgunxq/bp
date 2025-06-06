import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-modal-export-stats',
  template: `
    <mat-dialog-content>
      <h2 mat-dialog-title>Informácie o PDF výstupe z napísaných testov</h2>
      <p>
        Na tejto stránke si môžete
        <strong>vygenerovať PDF dokument</strong>
        obsahujúci kompletný prehľad vášho napísaného testu.
      </p>
      <p>Výstupný dokument bude obsahovať:</p>
      <ul>
        <li>prehľad úloh, ktoré ste riešili,</li>
        <li>vaše odpovede ku každej úlohe,</li>
        <li>správne riešenia,</li>
        <li>získané body a celkové hodnotenie,</li>
        <li>štatistiku úspešnosti podľa tém a obtiažnosti.</li>
      </ul>
      <p>PDF si môžete stiahnuť a použiť ako spätnú väzbu na zlepšovanie vedomostí, alebo ako záznam o svojich výsledkoch.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Zavrieť</button>
    </mat-dialog-actions>
  `,
})
export class InfoModalExportStatsComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoModalExportStatsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
