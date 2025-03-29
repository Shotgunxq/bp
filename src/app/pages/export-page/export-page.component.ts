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
  userId: string = '';
  tests: any[] = [];
  filteredTests: any[] = [];

  constructor(
    private apiService: ApiService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.adjustGridCols(window.innerWidth);
    this.fetchThemes();
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
    const userString = sessionStorage.getItem('user');
    if (userString) {
      const userObj = JSON.parse(userString);
      this.userId = userObj.userId;
    } else {
      this.userId = '';
    }
    this.apiService.getStatistics(Number(this.userId)).subscribe(
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
    function removeLatexCommands(text: string): string {
      // Remove entire LaTeX environment blocks (e.g. \begin{aligned} ... \end{aligned})
      text = text.replace(/\\begin\{[a-zA-Z]+\}[\s\S]*?\\end\{[a-zA-Z]+\}/g, '');
      // Replace \text{...} with the inner content
      text = text.replace(/\\text\{([^}]*)\}/g, '$1');
      // Remove any remaining backslash commands
      text = text.replace(/\\[a-zA-Z]+/g, '');
      return text.trim();
    }

    const documentDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      header: (currentPage: number, pageCount: number) => ({
        text: `Generované úlohy — Strana ${currentPage} z ${pageCount}`,
        alignment: 'center',
        style: 'header',
        margin: [0, 10, 0, 10],
      }),
      content: [
        { text: 'Generované úlohy', style: 'title', margin: [0, 0, 0, 20] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*'],
            body: [
              // Table header row with custom styling
              [
                { text: 'Zadanie', style: 'tableHeader' },
                { text: 'Nápovedy', style: 'tableHeader' },
                { text: 'Spravná odpoveď', style: 'tableHeader' },
              ],
              // Dynamic rows from exercises array
              ...this.exercises.map(ex => [
                { text: removeLatexCommands(ex.description) || '-', style: 'tableCell' },
                { text: ex.hints ? ex.hints.join(', ') : '-', style: 'tableCell' },
                { text: ex.correct_answer || '-', style: 'tableCell' },
              ]),
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10],
        },
      ],
      styles: {
        header: {
          fontSize: 10,
          bold: true,
          color: '#555555',
        },
        title: {
          fontSize: 22,
          bold: true,
        },
        tableHeader: {
          fontSize: 12,
          bold: true,
          fillColor: '#eeeeee',
          margin: [3, 3, 3, 3],
        },
        tableCell: {
          fontSize: 11,
          margin: [3, 3, 3, 3],
        },
      },
      defaultStyle: {
        fontSize: 11,
        lineHeight: 1.2,
      },
    };

    this.pdfService.generatePDF(documentDefinition, 'generated-exercises.pdf');
  }

  generateStatisticsPDF(): void {
    function removeLatexCommands(text: string): string {
      // Remove entire LaTeX environment blocks (e.g. \begin{aligned} ... \end{aligned})
      text = text.replace(/\\begin\{[a-zA-Z]+\}[\s\S]*?\\end\{[a-zA-Z]+\}/g, '');
      // Replace \text{...} with the inner content
      text = text.replace(/\\text\{([^}]*)\}/g, '$1');
      // Remove any remaining backslash commands
      text = text.replace(/\\[a-zA-Z]+/g, '');
      return text.trim();
    }
    // Build the content array dynamically
    const content: any[] = [];

    // Report title
    content.push({
      text: 'User Statistics Report',
      style: 'title',
      alignment: 'center',
      margin: [0, 0, 0, 20],
    });

    // Loop through each test
    this.tests.forEach((test, testIndex) => {
      // Add a page break before each test except the first
      if (testIndex > 0) {
        content.push({ text: '', pageBreak: 'before' });
      }

      // Group test header details in a stack
      content.push({
        stack: [
          { text: `Test ID: ${test.test_id}`, style: 'testHeader' },
          {
            columns: [
              { text: `Score: ${test.points_scored}`, style: 'subHeader' },
              { text: `Max Points: ${test.max_points}`, style: 'subHeader', alignment: 'right' },
            ],
            margin: [0, 5, 0, 5],
          },
          { text: `Submission Date: ${new Date(test.submission_date).toLocaleDateString()}`, style: 'subHeader', margin: [0, 0, 0, 15] },
        ],
      });

      // If there are exercises in the test, loop through each and create a table
      if (test.test_exercises && test.test_exercises.length > 0) {
        test.test_exercises.forEach(
          (
            ex: {
              description: any;
              difficulty_level: any;
              correct_answer: any;
              userAnswer: any;
              hints_used: { toString: () => any } | undefined;
              theme_name: any;
              theme: any;
            },
            exIndex: number
          ) => {
            // Optionally, add an exercise header
            content.push({
              text: `Exercise ${exIndex + 1}`,
              style: 'exerciseHeader',
              margin: [0, 10, 0, 5],
            });

            // Build a table with two columns (Field and Value)
            content.push({
              table: {
                headerRows: 1,
                widths: ['auto', '*'],
                body: [
                  [
                    { text: 'Field', style: 'tableHeader' },
                    { text: 'Value', style: 'tableHeader' },
                  ],
                  [
                    { text: 'Description', style: 'tableField' },
                    { text: removeLatexCommands(ex.description) || '-', style: 'tableValue' },
                  ],
                  [
                    { text: 'Difficulty Level', style: 'tableField' },
                    { text: ex.difficulty_level || '-', style: 'tableValue' },
                  ],
                  [
                    { text: 'Correct Answer', style: 'tableField' },
                    { text: ex.correct_answer || '-', style: 'tableValue' },
                  ],
                  [
                    { text: 'User Answer', style: 'tableField' },
                    { text: ex.userAnswer || '-', style: 'tableValue' },
                  ],
                  [
                    { text: 'Hints Used', style: 'tableField' },
                    { text: ex.hints_used !== undefined ? ex.hints_used.toString() : '0', style: 'tableValue' },
                  ],
                ],
              },
              layout: 'lightHorizontalLines',
              margin: [0, 0, 0, 10],
            });
          }
        );
      }
    });

    // Define the document with dynamic header and custom styles
    const documentDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      header: (currentPage: number, pageCount: number) => ({
        text: `Napísane testy — Strana ${currentPage} z ${pageCount}`,
        style: 'header',
        alignment: 'center',
        margin: [0, 10, 0, 10],
      }),
      content: content,
      styles: {
        header: {
          fontSize: 10,
          bold: true,
          color: '#555555',
        },
        title: {
          fontSize: 20,
          bold: true,
          color: '#2E86C1',
        },
        testHeader: {
          fontSize: 14,
          bold: true,
          color: '#2E86C1',
          margin: [0, 10, 0, 5],
        },
        subHeader: {
          fontSize: 11,
          margin: [0, 2, 0, 2],
        },
        exerciseHeader: {
          fontSize: 12,
          bold: true,
          margin: [0, 5, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          fillColor: '#eeeeee',
          margin: [3, 3, 3, 3],
        },
        tableField: {
          bold: true,
          fontSize: 11,
          margin: [3, 3, 3, 3],
        },
        tableValue: {
          fontSize: 11,
          margin: [3, 3, 3, 3],
        },
      },
      defaultStyle: {
        fontSize: 11,
        lineHeight: 1.2,
      },
    };

    this.pdfService.generatePDF(documentDefinition, 'user-statistics.pdf');
  }
}
