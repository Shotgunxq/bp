import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../services/admin.services';
import { ApiService } from '../../../../services/api.services';
import { InfoModalLatexComponent } from '../../../../components/modals/dialogs/info-modal-latex/info-modal-latex';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-new-exercise',
  templateUrl: './admin-new-exercise.component.html',
  styleUrls: ['./admin-new-exercise.component.scss'],
})
export class AdminNewExerciseComponent implements OnInit, AfterViewInit {
  exerciseForm: FormGroup;
  themes: any[] = [];

  // Define difficulty options.
  difficultyLevels = [
    { value: 'easy', viewValue: 'Ľahké' },
    { value: 'medium', viewValue: 'Stredné' },
    { value: 'hard', viewValue: 'Ťažké' },
  ];

  // For MathQuill integration.
  MQ: any = null;
  mathField: any;
  @ViewChild('mathFieldContainer') mathFieldContainer!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<AdminNewExerciseComponent>,
    private fb: FormBuilder,
    private adminService: AdminService,
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Build form with all necessary fields.
    this.exerciseForm = this.fb.group({
      theme_id: [null, Validators.required],
      difficulty_level: ['', Validators.required],
      description: ['', Validators.required],
      points: [0, [Validators.required, Validators.min(0)]],
      correct_answer: ['', Validators.required],
      hints: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Load available themes.
    this.apiService.getThemes().subscribe(
      (themes: any[]) => {
        this.themes = themes;
      },
      error => {
        console.error('Error fetching themes:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    // Initialize MathQuill for the description field.
    this.MQ = (window as any).MathQuill.getInterface(2);
    this.mathField = this.MQ.MathField(this.mathFieldContainer.nativeElement, {
      spaceBehavesLikeTab: false,
      supSubsRequireOperand: true,
      maxDepth: 1,
      handlers: {
        edit: (fieldInstance: any) => {
          // Update the form control with the current LaTeX.
          this.exerciseForm.patchValue({ description: fieldInstance.latex() });
        },
      },
    });
  }

  // Convert plain text into a multiline LaTeX string.
  // This splits the input into sentences and joins them with LaTeX line-breaks.
  private convertToMultiline(input: string): string {
    const sentences = input.split(/(?<=[.!?])\s+/).filter(sentence => sentence.trim() !== '');
    return sentences.join(' \\\\\n');
  }

  onConfirm(): void {
    if (this.exerciseForm.valid) {
      const newExercise = this.exerciseForm.value;

      // Automatically convert the description to multiline LaTeX format.
      newExercise.description = this.convertToMultiline(newExercise.description);

      // Process hints: split by newline, trim, filter out empty lines,
      // then stringify the array so it is stored as valid JSON.
      const hintsArray = newExercise.hints
        .split('\n')
        .map((hint: string) => hint.trim())
        .filter((hint: string) => hint.length > 0);
      newExercise.hints = JSON.stringify(hintsArray);

      // Create the new exercise.
      this.adminService.createExercise(newExercise).subscribe(
        response => {
          console.log('Exercise created successfully:', response);
          this.snackBar.open('Úloha vytvorená! Načítajte znovu stránku', 'Zatvoriť', { duration: 13000 });

          this.dialogRef.close(response);
        },
        error => {
          console.error('Error creating exercise:', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  openInfoDialog(): void {
    this.dialog.open(InfoModalLatexComponent, {
      width: '500px', // Adjust width as needed
    });
  }
}
