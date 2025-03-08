import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../services/adminServices';
import { ApiService } from '../../../../services/apiServices';

@Component({
  selector: 'app-admin-new-exercise',
  templateUrl: './admin-new-exercise.component.html',
  styleUrls: ['./admin-new-exercise.component.scss'],
})
export class AdminNewExerciseComponent implements OnInit {
  exerciseForm: FormGroup;
  themes: any[] = [];

  // Define difficulty options
  difficultyLevels = [
    { value: 'easy', viewValue: 'Easy' },
    { value: 'medium', viewValue: 'Medium' },
    { value: 'hard', viewValue: 'Hard' },
  ];

  constructor(
    public dialogRef: MatDialogRef<AdminNewExerciseComponent>,
    private fb: FormBuilder,
    private adminService: AdminService,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Build form with theme_id dropdown
    this.exerciseForm = this.fb.group({
      theme_id: [null, Validators.required],
      difficulty_level: ['', Validators.required],
      description: ['', Validators.required],
      image: [false],
      points: [0, [Validators.required, Validators.min(0)]],
      correct_answer: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Load available themes from the API
    this.apiService.getThemes().subscribe(
      (themes: any[]) => {
        this.themes = themes;
      },
      error => {
        console.error('Error fetching themes:', error);
      }
    );
  }
  private convertToMultiline(input: string): string {
    // Split the input text at sentence-ending punctuation (. ? !) followed by a space.
    const sentences = input.split(/(?<=[.!?])\s+/);
    // Remove any empty lines
    const filtered = sentences.filter(sentence => sentence.trim() !== '');
    // Format each sentence with an ampersand and wrap it with \text{...}
    const formattedLines = filtered.map(sentence => `& \\text{${sentence.trim()}}`);
    // Wrap all lines in the aligned environment, joining with LaTeX's line break command (\\)
    return `\\begin{aligned}\n${formattedLines.join(' \\\\\n')}\n\\end{aligned}`;
  }

  onConfirm(): void {
    if (this.exerciseForm.valid) {
      // Get form values
      const newExercise = this.exerciseForm.value;

      // Automatically convert the description to the multiline LaTeX format
      newExercise.description = this.convertToMultiline(newExercise.description);

      // If image checkbox is false, set image to null
      if (!newExercise.image) {
        newExercise.image = null;
      }
      // Call the admin service to create a new exercise
      this.adminService.createExercise(newExercise).subscribe(
        response => {
          console.log('Exercise created successfully:', response);
          // Close the dialog and pass the response back
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error creating exercise:', error);
          // Optionally show an error message to the user
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
