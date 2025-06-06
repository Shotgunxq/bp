import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-modal-percentil',
  template: `
    <mat-dialog-content>
      <h2 mat-dialog-title>Informácie o výpočte percentilu</h2>
      <p>Percentil vyjadruje, aká časť ostatných používateľov získala rovnaký alebo nižší celkový počet bodov ako vy.</p>

      <p>Výpočet prebieha v niekoľkých krokoch:</p>
      <ul>
        <li>
          <strong>Celkový počet bodov:</strong>
          Spočíta sa súčet bodov, ktoré ste získali vo všetkých vašich testoch.
        </li>
        <li>
          <strong>Porovnanie s ostatnými:</strong>
          Spočíta sa, koľko používateľov má rovnaký alebo nižší súčet bodov ako vy.
        </li>
        <li>
          <strong>Výpočet percentilu:</strong>
          Percentil sa vypočíta ako pomer počtu týchto používateľov k celkovému počtu všetkých používateľov, vynásobený číslom 100.
        </li>
      </ul>

      <p>
        <strong>Príklad:</strong>
        Ak máte vyšší alebo rovnaký počet bodov ako 80 zo 100 používateľov, váš percentil je
        <strong>80</strong>
        .
      </p>

      <p>
        Vyšší percentil znamená lepšie hodnotenie v porovnaní s ostatnými používateľmi. Percentil
        <strong>100</strong>
        znamená, že ste získali najvyšší počet bodov spomedzi všetkých používateľov.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Zavrieť</button>
    </mat-dialog-actions>
  `,
})
export class InfoModalPercentilComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoModalPercentilComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
