import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-new-exercise',
  templateUrl: './admin-new-exercise.component.html',
  styleUrl: './admin-new-exercise.component.scss',
})
export class AdminNewExerciseComponent {
  inputData: string = '';

  constructor(
    public dialogRef: MatDialogRef<AdminNewExerciseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.inputData = data.inputValue || '';
    }
  }

  onConfirm(): void {
    console.log('Confirmed:', this.inputData);
    this.dialogRef.close(this.inputData); // Pass the data back
  }

  onClose(): void {
    this.dialogRef.close(); // Close the dialog without action
  }
}
