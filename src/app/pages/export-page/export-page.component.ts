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
    // Build the content for the PDF
    const content: any[] = [{ text: 'User Statistics Report', style: 'header', alignment: 'center', margin: [0, 0, 0, 20] }];

    // Loop over each test from the API response
    this.tests.forEach(test => {
      // Test header information
      content.push({
        text: `Test ID: ${test.test_id}`,
        style: 'testHeader',
        margin: [0, 10, 0, 5],
      });
      content.push({
        columns: [
          { text: `Score: ${test.points_scored}`, style: 'subHeader' },
          { text: `Max Points: ${test.max_points}`, style: 'subHeader', alignment: 'right' },
        ],
      });
      content.push({
        text: `Submission Date: ${new Date(test.submission_date).toLocaleDateString()}`,
        style: 'subHeader',
        margin: [0, 0, 0, 10],
      });

      // Build a table for the exercises in this test if available
      if (test.test_exercises && test.test_exercises.length > 0) {
        const tableBody = [];
        // Table header row
        tableBody.push([
          { text: 'Exercise', style: 'tableHeader' },
          { text: 'Details', style: 'tableHeader' },
          { text: 'Points', style: 'tableHeader' },
        ]);

        // Loop over each exercise in the test
        test.test_exercises.forEach(
          (
            ex: {
              description: string;
              exercise_id: { toString: () => any };
              difficulty_level: any;
              correct_answer: any;
              answer: any;
              probability: any;
              points: { toString: () => any };
            },
            idx: number
          ) => {
            // Prepare a short description (truncate if too long)
            let description = ex.description || '';
            if (description.length > 100) {
              description = description.substring(0, 100) + '...';
            }
            // Build details based on exercise type
            let details = '';
            if (ex.exercise_id) {
              details = `Difficulty: ${ex.difficulty_level}\nCorrect Answer: ${ex.correct_answer}`;
            } else {
              details = `Answer: ${ex.answer}\nProbability: ${ex.probability}`;
            }

            tableBody.push([
              { text: ex.exercise_id ? ex.exercise_id.toString() : (idx + 1).toString(), margin: [0, 2, 0, 2] },
              { text: description + '\n' + details, margin: [0, 2, 0, 2] },
              { text: ex.points ? ex.points.toString() : '-', margin: [0, 2, 0, 2] },
            ]);
          }
        );

        content.push({
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto'],
            body: tableBody,
          },
          layout: {
            fillColor: (rowIndex: number) => (rowIndex === 0 ? '#CCCCCC' : null),
          },
          margin: [0, 0, 0, 20],
        });
      }
    });

    // Define the document definition
    const documentDefinition = {
      pageMargins: [40, 60, 40, 60],
      header: {
        columns: [{ text: 'User Statistics Report', style: 'header', alignment: 'center' }],
      },
      footer: (currentPage: number, pageCount: number) => ({
        text: `${currentPage} / ${pageCount}`,
        alignment: 'center',
        margin: [0, 0, 0, 20],
      }),
      content: content,
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        testHeader: {
          fontSize: 16,
          bold: true,
          color: '#2E86C1',
        },
        subHeader: {
          fontSize: 12,
          margin: [0, 2, 0, 2],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
        },
      },
    };

    // Generate the PDF using your PdfService
    this.pdfService.generatePDF(documentDefinition, 'user-statistics.pdf');
  }

  printStatistics(): void {
    window.print();
  }
}
