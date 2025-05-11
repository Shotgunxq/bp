import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.services';
import { binomialProbabilityRandom } from '../../services/binomialProbability.helper';
import { hypergeometricProbabilityRandom } from '../../services/hypergeometricProbality.helper';
import { geometricProbabilityRandom } from '../../services/geometricProbability.helper';
import { MatDialog } from '@angular/material/dialog';
import { InfoModalTestCreationComponent } from '../../components/modals/dialogs/info-moda-test-creation/info-modal-test-creation';
import { uniformDistributionRandom } from '../../services/uniformDistribution.helper';
@Component({
  selector: 'app-test-creation',
  templateUrl: './test-creation.component.html',
  styleUrls: ['./test-creation.component.scss'],
})
export class TestCreationComponent implements OnInit {
  gridCols = 3;
  times = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
  selectedTime = 5;

  isGamificationEnabled = false;
  isEasyEnabled = false;
  isMediumEnabled = false;
  isHardEnabled = false;

  easyCount = 0;
  mediumCount = 0;
  hardCount = 0;

  themes: { theme_id: number; theme_name: string; selected: boolean }[] = [];
  exercises: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private apiService: ApiService,
    private dialog: MatDialog // <-- Inject MatDialog
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.adjustGridCols(window.innerWidth);
  }

  ngOnInit(): void {
    this.adjustGridCols(window.innerWidth);
    this.fetchThemes();
    localStorage.clear();
  }

  adjustGridCols(width: number) {
    this.gridCols = width >= 1150 ? 3 : 1;
  }

  fetchThemes(): void {
    this.apiService.getThemes().subscribe(
      response => (this.themes = response.map((t: any) => ({ ...t, selected: false }))),
      error => console.error('Error fetching themes:', error)
    );
  }

  preventNegativeValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value && parseInt(input.value, 10) < 0) {
      input.value = '0';
    }
  }

  getSelectedThemeIds(): number[] {
    return this.themes.filter(theme => theme.selected).map(theme => theme.theme_id);
  }

  async getData(): Promise<void> {
    const selectedThemes = this.getSelectedThemeIds();
    const queryParams = `?easy=${this.easyCount}&medium=${this.mediumCount}&hard=${this.hardCount}&themes=${selectedThemes.join(',')}`;

    this.apiService.getExercises(queryParams).subscribe(
      response => {
        const easyGen = [...binomialProbabilityRandom(), ...uniformDistributionRandom()];
        const medGen = [...hypergeometricProbabilityRandom()];
        const hardGen = [...geometricProbabilityRandom()];

        const easy = this.mixExercises(
          response.exercises.filter((e: { difficulty_level: string }) => e.difficulty_level === 'easy'),
          easyGen,
          this.easyCount
        );
        const medium = this.mixExercises(
          response.exercises.filter((e: { difficulty_level: string }) => e.difficulty_level === 'medium'),
          medGen,
          this.mediumCount
        );
        const hard = this.mixExercises(
          response.exercises.filter((e: { difficulty_level: string }) => e.difficulty_level === 'hard'),
          hardGen,
          this.hardCount
        );

        this.exercises = [...easy, ...medium, ...hard];
        if (!this.exercises.length) {
          alert('No exercises found to create a test.');
          return;
        }

        const writingTime = `00:${this.selectedTime.toString().padStart(2, '0')}:00`;
        this.apiService.createTest(this.exercises, writingTime).subscribe(
          testRes => {
            this.router.navigate(['/test-writing'], {
              state: {
                testId: testRes.test_id,
                data: this.exercises,
                timeLimit: writingTime,
                gamification: this.isGamificationEnabled,
              },
            });
          },
          err => console.error('Error creating test:', err)
        );
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

    return this.shuffleArray([...fetched.slice(0, fetchedCount), ...generated.slice(0, generatedCount)]);
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  openInfoDialog(): void {
    this.dialog.open(InfoModalTestCreationComponent, {
      width: '500px', // Adjust width as needed
    });
  }
}
