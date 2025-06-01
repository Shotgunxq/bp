import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-dialog',
  template: `
    <h2 mat-dialog-title>Upraviť úlohu</h2>
    <mat-dialog-content [formGroup]="editForm">
      <!-- MathQuill Editor for Description (outside of mat-form-field) -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-weight: 500; margin-bottom: 4px;">Znenie úlohy</label>
        <div #mathFieldContainer style="min-height: 40px; border: 1px solid rgba(0,0,0,0.38); padding: 8px; cursor: text;"></div>
      </div>

      <!-- Standard field for Answer -->
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Spravná odpoveď</mat-label>
        <textarea matInput formControlName="correct_answer"></textarea>
      </mat-form-field>

      <!-- Field for Points -->
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Body</mat-label>
        <textarea matInput formControlName="points"></textarea>
      </mat-form-field>

      <!-- Field for Difficulty Level -->
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Obtiažnosť</mat-label>
        <mat-select formControlName="difficulty_level">
          <mat-option value="easy">Easy</mat-option>
          <mat-option value="medium">Medium</mat-option>
          <mat-option value="hard">Hard</mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Field for Hints -->
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Nápoveď (jeden na riadok)</mat-label>
        <textarea matInput formControlName="hints" rows="5"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Zatvoriť</button>
      <button mat-button color="primary" (click)="onConfirm()" [disabled]="editForm.invalid">Potvrdiť</button>
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
    private adminService: AdminService,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {
    // Convert the hints array to a newline-separated string.
    const hintsString = data.exercise.hints && Array.isArray(data.exercise.hints) ? data.exercise.hints.join('\n') : '';

    // Initialize the form with current exercise details.
    // Note the new "difficulty_level" control. We default to 'easy' if none is provided.
    this.editForm = this.fb.group({
      description: [data.exercise.description, Validators.required],
      correct_answer: [data.exercise.correct_answer, Validators.required],
      points: [data.exercise.points, Validators.required],
      difficulty_level: [data.exercise.difficulty_level || 'easy', Validators.required],
      hints: [hintsString, Validators.required],
    });
  }

  ngAfterViewInit(): void {
    // Get MathQuill's interface (version 2)
    this.MQ = (window as any).MathQuill.getInterface(2);

    let description = this.data.exercise.description || '';

    if (description.includes('\\begin{aligned}') && description.includes('\\end{aligned}')) {
      description = description
        .replace(/\\begin\{aligned\}/g, '')
        .replace(/\\end\{aligned\}/g, '')
        .replace(/\\\\/g, ' ')
        .replace(/&/g, ' ');
      description = description.replace(/\.\.\./g, '\\dots');
      description = description.replace(/\\emptyset/g, '\\varnothing');
    }

    this.mathField = this.MQ.MathField(this.mathFieldContainer.nativeElement, {
      spaceBehavesLikeTab: false,
      supSubsRequireOperand: true,
      maxDepth: 1,
      handlers: {
        edit: (fieldInstance: any) => {
          this.editForm.patchValue({ description: fieldInstance.latex() });
        },
      },
    });

    this.mathField.latex(description);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    const formValues = this.editForm.value;
    const hintsArray = formValues.hints
      .split('\n')
      .map((hint: string) => hint.trim())
      .filter((hint: string) => hint.length > 0);

    const updatedExercise = {
      ...this.data.exercise,
      ...formValues,
      hints: hintsArray,
    };

    this.adminService.updateExercise(updatedExercise).subscribe(
      response => {
        this.snackBar.open('Úloha prepísaná!', 'Close', { duration: 7000 });

        this.dialogRef.close(response.updatedExercise || updatedExercise);
      },
      error => {
        console.error('Error updating exercise:', error);
      }
    );
  }
}
