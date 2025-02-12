import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../services/adminServices';

@Component({
  selector: 'app-edit-dialog',
  template: `
    <h2 mat-dialog-title>Edit Exercise</h2>
    <mat-dialog-content [formGroup]="editForm">
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description"></textarea>
      </mat-form-field>
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Answer</mat-label>
        <textarea matInput formControlName="correct_answer"></textarea>
      </mat-form-field>
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Points</mat-label>
        <textarea matInput formControlName="points"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Close</button>
      <button mat-button color="primary" (click)="onConfirm()" [disabled]="editForm.invalid">Confirm</button>
    </mat-dialog-actions>
  `,
})
export class EditDialogComponent {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { exercise: any },
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    // Initialize the form with the current exercise details
    this.editForm = this.fb.group({
      description: [data.exercise.description, Validators.required],
      correct_answer: [data.exercise.correct_answer, Validators.required],
      points: [data.exercise.points, Validators.required],
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    const updatedExercise = {
      ...this.data.exercise,
      ...this.editForm.value,
    };

    // Use the update API which now references exercise.exercise_id
    this.adminService.updateExercise(updatedExercise).subscribe(
      response => {
        this.dialogRef.close(response.updatedExercise || updatedExercise);
      },
      error => {
        console.error('Error updating exercise:', error);
      }
    );
  }
}
