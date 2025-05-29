import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-modal-latex',
  template: `
    <mat-dialog-content>
      <h2 mat-dialog-title>Informácie k vkladanému LaTeX-u</h2>
      <p>Znenie úlohy je špeciálny textový blok, kde môžete zadávať LaTeXové príkazy na pridávanie matematických symbolov či zápisov.</p>
      <p>
        Po zapísaní LaTeXovej syntaxe stačí stlačiť medzerník, aby ste videli, čo ste napísali. Predvolený režim v tomto bloku je matematický; ak
        chcete vložiť obyčajný text, používajte ext"{{ '{' }}"..."{{ '}' }}".
      </p>
      <p>V matematickom režime medzerník reprezentuje únikový znak ,, takže na vloženie skutočnej medzery použite ; alebo quad.</p>
      <p>
        Pozor! Ak chcete zapísať množinu čísel, napr. A = "{{ '{' }}"1,2,3"{{ '}' }}", napíšte ju priamo ako A = "{{ '{' }}"1,2,3"{{ '}' }}" (nie ako
        A = "{{ '{' }}"1,2,3"{{ '}' }}").
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Zavrieť</button>
    </mat-dialog-actions>
  `,
})
export class InfoModalLatexComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoModalLatexComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
