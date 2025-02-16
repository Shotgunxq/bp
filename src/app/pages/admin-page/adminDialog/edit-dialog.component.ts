import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../services/adminServices';

@Component({
  selector: 'app-edit-dialog',
  template: `
    <h2 mat-dialog-title>Edit Exercise</h2>
    <mat-dialog-content [formGroup]="editForm">
      <!-- MathQuill Editor for Description (outside of mat-form-field) -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-weight: 500; margin-bottom: 4px;">Description</label>
        <div #mathFieldContainer style="min-height: 40px; border: 1px solid rgba(0,0,0,0.38); padding: 8px; cursor: text;"></div>
      </div>

      <!-- Standard field for Answer -->
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Answer</mat-label>
        <textarea matInput formControlName="correct_answer"></textarea>
      </mat-form-field>

      <!-- Field for Points -->
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
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent implements AfterViewInit {
  editForm: FormGroup;
  MQ: any = null;
  mathField: any;

  @ViewChild('mathFieldContainer') mathFieldContainer!: ElementRef;

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

  ngAfterViewInit(): void {
    // Get MathQuill's interface (version 2)
    this.MQ = (window as any).MathQuill.getInterface(2);
    // Prepare the description text fetched from the API
    let description = this.data.exercise.description || '';
    // If the description doesn't start with "\text{", wrap it in \text{...}
    if (!description.trim().startsWith('\\text{')) {
      description = `\\text{${description}}`;
    }
    // Initialize the MathQuill field on the container element
    this.mathField = this.MQ.MathField(this.mathFieldContainer.nativeElement, {
      spaceBehavesLikeTab: true,
      supSubsRequireOperand: true,
      maxDepth: 1,
      handlers: {
        edit: (fieldInstance: any) => {
          // When the MathQuill field is edited, update the form control.
          // You might want to remove the \text{...} wrapper before saving, depending on your use case.
          this.editForm.patchValue({ description: fieldInstance.latex() });
        },
      },
    });
    // Set the initial LaTeX value in the MathQuill field
    this.mathField.latex(description);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    const updatedExercise = {
      ...this.data.exercise,
      ...this.editForm.value,
    };

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
