import { Component, HostListener, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.services';
import { PdfService } from '../../services/helper/pdf.helper';

// Import your exercise generation functions
import { binomialProbabilityRandom } from '../../services/helper/binomialProbability.helper';
import { hypergeometricProbabilityRandom } from '../../services/helper/hypergeometricProbality.helper';
import { geometricProbabilityRandom } from '../../services/helper/geometricProbability.helper';
import { filter, switchMap, take } from 'rxjs';

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
      alert('Prosím, uveďte platný celkový počet cvičení.');
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
    this.apiService
      .getCurrentUser()
      .pipe(
        filter(u => !!u), // wait until we have a non-null user
        take(1),
        switchMap(u => {
          this.userId = u.userId;
          return this.apiService.getStatistics(Number(this.userId));
        })
      )
      .subscribe(
        (data: any[]) => {
          // “data” is an array of test‐level objects; each has:
          //   - test_exercises: Array<{ exercise_id, description, correct_answer, … }>
          //   - submitted_answers: Array<{ exercise_id, user_answer, hints_used? }>
          this.tests = data.map(test => {
            // 1) Build a map from exercise_id → { user_answer, hints_used }
            const answers: Array<{
              exercise_id: number;
              user_answer: string;
              hints_used?: number;
            }> = test.submitted_answers || [];

            const answerMap = new Map<number, { user_answer: string; hints_used: number }>();
            answers.forEach(a =>
              answerMap.set(a.exercise_id, {
                user_answer: a.user_answer,
                hints_used: a.hints_used ?? 0,
              })
            );

            // 2) “Merge” that into each test_exercise
            const mergedExercises = (test.test_exercises || []).map((ex: any) => {
              const ans = answerMap.get(ex.exercise_id) || {
                user_answer: '',
                hints_used: 0,
              };

              return {
                ...ex,
                userAnswer: ans.user_answer,
                hintsUsed: ans.hints_used,
              };
            });

            return {
              ...test,
              test_exercises: mergedExercises,
            };
          });

          // Copy into filteredTests (for any further UI filtering/pagination)
          this.filteredTests = [...this.tests];
        },
        err => console.error('Error fetching data:', err)
      );
  }

  // --- PDF Generation Methods ---
  generateExercisesPDF(): void {
    // use the improved removeLatexCommands
    function removeLatexCommands(input: any): string {
      if (typeof input !== 'string') {
        return '';
      }

      let text = input;
      text = text.replace(/\\begin\{[a-zA-Z]+\}/g, '');
      text = text.replace(/\\end\{[a-zA-Z]+\}/g, '');
      text = text.replace(/\\\\/g, ' ');
      text = text.replace(/&/g, ' ');
      text = text.replace(/\\text\{([^}]*)\}/g, '$1');
      text = text.replace(/\\[a-zA-Z]+/g, '');
      text = text.replace(/\s\s+/g, ' ').trim();
      return text;
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
              // table headers
              [
                { text: 'Zadanie', style: 'tableHeader' },
                { text: 'Nápovedy', style: 'tableHeader' },
                { text: 'Spravná odpoveď', style: 'tableHeader' },
              ],
              // map your exercises → each row must have exactly 3 cells
              ...this.exercises.map(ex => {
                // Optionally log to console, but don't put the log itself into the array:
                console.log('full ex.description:', ex.description);

                return [
                  { text: removeLatexCommands(ex.description) || '-', style: 'tableCell' },
                  { text: ex.hints ? ex.hints.join(', ') : '-', style: 'tableCell' },
                  { text: ex.correct_answer || '-', style: 'tableCell' },
                ];
              }),
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10],
        },
      ],
      styles: {
        header: { fontSize: 10, bold: true, color: '#555555' },
        title: { fontSize: 22, bold: true },
        tableHeader: { fontSize: 12, bold: true, fillColor: '#eeeeee', margin: [3, 3, 3, 3] },
        tableCell: { fontSize: 11, margin: [3, 3, 3, 3] },
      },
      defaultStyle: {
        fontSize: 11,
        lineHeight: 1.2,
      },
    };

    this.pdfService.generatePDF(documentDefinition, 'generated-exercises.pdf');
  }

  generateStatisticsPDF(): void {
    // A more robust helper that only strips LaTeX markup, but preserves inner text.
    function removeLatexCommands(input: any): string {
      if (typeof input !== 'string') {
        return '';
      }

      let text = input;

      // 1) Remove just the \begin{…} and \end{…} markers (but keep inner content)
      text = text.replace(/\\begin\{[a-zA-Z]+\}/g, '');
      text = text.replace(/\\end\{[a-zA-Z]+\}/g, '');

      // 2) Remove LaTeX line‐breaks (\\) and alignment markers (&)
      text = text.replace(/\\\\/g, ' ');
      text = text.replace(/&/g, ' ');

      // 3) Pull out the inside of \text{…}
      text = text.replace(/\\text\{([^}]*)\}/g, '$1');

      // 4) Remove any remaining backslash commands like \alpha, \frac, etc.
      text = text.replace(/\\[a-zA-Z]+/g, '');

      // 5) Collapse multiple spaces into one, then trim
      text = text.replace(/\s\s+/g, ' ').trim();

      return text;
    }

    // Build the PDF content array
    const content: any[] = [];

    // ----- 1) Report title -----
    content.push({
      text: 'User Statistics Report',
      style: 'title',
      alignment: 'center',
      margin: [0, 0, 0, 20],
    });

    // ----- 2) Loop through each test -----
    this.tests.forEach((test, testIndex) => {
      // Page‐break before every test except the first
      if (testIndex > 0) {
        content.push({ text: '', pageBreak: 'before' });
      }

      // 2a) Test header block (stack of lines)
      content.push({
        stack: [
          { text: `Test ID: ${test.test_id}`, style: 'testHeader' },
          {
            columns: [
              { text: `Dosiahnuté body: ${test.points_scored}`, style: 'subHeader' },
              {
                text: `Max počet bodov: ${test.max_points}`,
                style: 'subHeader',
                alignment: 'right',
              },
            ],
            margin: [0, 5, 0, 5],
          },
          {
            text: `Dátum odovzdania: ${new Date(test.submission_date).toLocaleDateString()}`,
            style: 'subHeader',
            margin: [0, 0, 0, 15],
          },
        ],
      });

      // 2b) If there are exercises in this test, build a small 2‐column table for each one
      if (Array.isArray(test.test_exercises) && test.test_exercises.length > 0) {
        console.log('exercise:', test.test_exercises),
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
              // 2b(i) Section header for this exercise
              content.push({
                text: `Úloha ${exIndex + 1}`,
                style: 'exerciseHeader',
                margin: [0, 10, 0, 5],
              });

              // 2b(ii) Build a 2‐column “Field / Value” table
              const tableBody = [
                [
                  { text: 'Znenie úlohy', style: 'tableField' },
                  {
                    text: removeLatexCommands(ex.description) || '-',
                    style: 'tableValue',
                  },
                ],
                [
                  { text: 'Obtiažnosť', style: 'tableField' },
                  { text: ex.difficulty_level || '-', style: 'tableValue' },
                ],
                [
                  { text: 'Spravná odpoveď', style: 'tableField' },
                  { text: ex.correct_answer || '-', style: 'tableValue' },
                ],
                [
                  { text: 'Zadaná odpoveď', style: 'tableField' },
                  { text: ex.userAnswer || '-', style: 'tableValue' },
                ],
                [
                  { text: 'Použité nápovedy', style: 'tableField' },
                  {
                    text: ex.hints_used !== undefined ? ex.hints_used.toString() : '0',
                    style: 'tableValue',
                  },
                ],
              ];

              content.push({
                table: {
                  headerRows: 0, // we’re not repeating a header row here
                  widths: ['auto', '*'],
                  body: tableBody,
                },
                layout: 'lightHorizontalLines',
                margin: [0, 0, 0, 10],
              });
            }
          );
      }
    });

    // ----- 3) Define the PDF documentDefinition -----
    const documentDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      header: (currentPage: number, pageCount: number) => ({
        text: `Napísané testy — Strana ${currentPage} z ${pageCount}`,
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

    // ----- 4) Generate the PDF -----
    this.pdfService.generatePDF(documentDefinition, 'user-statistics.pdf');
  }
}
