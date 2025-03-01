import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Deletion</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
      <!-- Test MathQuill Field -->
      <div
        #mathFieldContainer
        id="confirm-math-field"
        style="min-height: 40px; border: 1px solid rgba(0,0,0,0.38); padding: 8px; cursor: text; margin-top: 16px;"></div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">No</button>
      <button mat-button color="warn" (click)="onYesClick()">Yes</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent implements AfterViewInit {
  @ViewChild('mathFieldContainer') mathFieldContainer!: ElementRef;
  MQ: any;
  mathField: any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  ngAfterViewInit(): void {
    // Ensure MathQuill is available on the window object.
    this.MQ = (window as any).MathQuill.getInterface(2);
    if (this.mathFieldContainer) {
      // Initialize MathQuill on the container.
      this.mathField = this.MQ.MathField(this.mathFieldContainer.nativeElement, {
        spaceBehavesLikeTab: true,
        supSubsRequireOperand: true,
        maxDepth: 1,
        handlers: {
          edit: (fieldInstance: any) => {
            // For testing: log the current LaTeX output.
            console.log('Confirm Dialog MathQuill LaTeX:', fieldInstance.latex());
          },
        },
      });
      // Optionally set an initial LaTeX value.
      this.mathField.latex('Confirm?');
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
