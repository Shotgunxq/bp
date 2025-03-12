import { Component, HostListener, OnInit } from '@angular/core';
import { ApiService } from '../../services/apiServices';
import { PdfService } from '../../services/pdf.service';

// Import your exercise generation functions
import { binomialProbabilityRandom } from '../../services/binomialProbability';
import { hypergeometricProbabilityRandom } from '../../services/hypergeometricProbality';
import { geometricProbabilityRandom } from '../../services/geometricProbability';

@Component({
  selector: 'app-export-page',
  templateUrl: './export-page.component.html',
  styleUrls: ['./export-page.component.scss'],
})
export class ExportPageComponent implements OnInit {
  // For exercise selection
  gridCols: number = 3;
  isEasyEnabled: boolean = false;
  isMediumEnabled: boolean = false;
  isHardEnabled: boolean = false;

  easyCount: number = 0;
  mediumCount: number = 0;
  hardCount: number = 0;

  themes: { theme_id: number; theme_name: string; selected: boolean }[] = [];
  exercises: any[] = [];

  // For user statistics
  tests: any[] = [];
  filteredTests: any[] = [];

  constructor(
    private apiService: ApiService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.adjustGridCols(window.innerWidth);
    this.fetchThemes();
    // Fetch user statistics (using userId=1 for now)
    this.fetchDataFromDatabase();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.adjustGridCols(window.innerWidth);
  }

  adjustGridCols(width: number): void {
    this.gridCols = width >= 1150 ? 3 : 1;
  }

  fetchThemes(): void {
    this.apiService.getThemes().subscribe(
      (response: any[]) => {
        this.themes = response.map((theme: any) => ({
          ...theme,
          selected: false,
        }));
      },
      (error: any) => console.error('Error fetching themes:', error)
    );
  }

  preventNegativeValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value && parseInt(input.value, 10) < 0) {
      input.value = '0';
    }
  }

  validateTotalExerciseCount(): boolean {
    const total = this.easyCount + this.mediumCount + this.hardCount;
    return total > 0;
  }

  getSelectedThemeIds(): number[] {
    return this.themes.filter(theme => theme.selected).map(theme => theme.theme_id);
  }

  async getData(): Promise<void> {
    if (!this.validateTotalExerciseCount()) {
      alert('Please specify a valid total exercise count.');
      return;
    }

    const selectedThemes = this.getSelectedThemeIds();

    // Generate exercises using your service functions
    const generatedEasy = binomialProbabilityRandom();
    const generatedMedium = hypergeometricProbabilityRandom();
    const generatedHard = geometricProbabilityRandom();

    const queryParams = `?easy=${this.easyCount}&medium=${this.mediumCount}&hard=${this.hardCount}&themes=${selectedThemes.join(',')}`;

    this.apiService.getExercises(queryParams).subscribe(
      response => {
        const easy = this.mixExercises(
          response.exercises.filter((e: any) => e.difficulty_level === 'easy'),
          generatedEasy,
          this.easyCount
        );
        const medium = this.mixExercises(
          response.exercises.filter((e: any) => e.difficulty_level === 'medium'),
          generatedMedium,
          this.mediumCount
        );
        const hard = this.mixExercises(
          response.exercises.filter((e: any) => e.difficulty_level === 'hard'),
          generatedHard,
          this.hardCount
        );

        this.exercises = [...easy, ...medium, ...hard];

        if (this.exercises.length === 0) {
          alert('No exercises found to generate.');
          return;
        }
        // Directly generate the PDF without any routing.
        this.generateExercisesPDF();
      },
      error => console.error('Error fetching exercises:', error)
    );
  }

  mixExercises(fetched: any[], generated: any[], count: number): any[] {
    let fetchedCount = Math.min(fetched.length, Math.ceil(count / 2));
    let generatedCount = count - fetchedCount;

    if (generatedCount > generated.length) {
      fetchedCount += generatedCount - generated.length;
      generatedCount = generated.length;
    }

    if (fetchedCount > fetched.length) {
      generatedCount += fetchedCount - fetched.length;
      fetchedCount = fetched.length;
    }

    const selectedFetched = fetched.slice(0, fetchedCount);
    const selectedGenerated = generated.slice(0, generatedCount);

    return this.shuffleArray([...selectedFetched, ...selectedGenerated]);
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // --- User Statistics Methods ---
  fetchDataFromDatabase(): void {
    const userId = 1; // Hardcoded userId; adjust with your real logic if needed.
    this.apiService.getStatistics(userId).subscribe(
      (data: any[]) => {
        console.log('Test data:', data[0]?.testId);
        this.tests = data;
        this.filteredTests = [...this.tests];
        this.setPagedTests();
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  // Dummy pagination logic; customize as needed.
  setPagedTests(): void {
    // Implement your pagination logic here if required.
  }

  // --- PDF Generation Methods ---
  generateExercisesPDF(): void {
    const documentDefinition = {
      content: [
        { text: 'Generated Exercises', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*'],
            body: [
              // Table header using proper labels
              ['Exercise ID', 'Difficulty', 'Description'],
              // Map the exercises array using the correct keys from the API response
              ...this.exercises.map(ex => [ex.exercise_id || '-', ex.difficulty_level || '-', ex.description || '-']),
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 22, bold: true, margin: [0, 0, 0, 10] },
      },
    };

    this.pdfService.generatePDF(documentDefinition, 'generated-exercises.pdf');
  }

  generateStatisticsPDF(): void {
    const documentDefinition = {
      content: [
        { text: 'User Statistics', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', '*', 'auto'],
            body: [
              ['Test ID', 'Score', 'Submission Date', 'Exercises', 'Max Points'],
              ...this.tests.map(test => [
                test.testId || '-',
                test.score || '-',
                test.submissionDate ? new Date(test.submissionDate).toLocaleDateString() : '-',
                JSON.stringify(test.exercises) || '-',
                test.maxPoints || '-',
              ]),
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 22, bold: true, margin: [0, 0, 0, 10] },
      },
    };

    this.pdfService.generatePDF(documentDefinition, 'user-statistics.pdf');
  }

  printStatistics(): void {
    window.print();
  }
}
