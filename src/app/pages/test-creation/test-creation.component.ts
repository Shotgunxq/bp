import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../services/apiServices';

import { binomialExercise, binomialProbabilityRandom } from '../../services/binomialProbability';
import { hypergeometricExercises, hypergeometricProbabilityRandom } from '../../services/hypergeometricProbality';
import { geometricExercise, geometricProbabilityRandom } from '../../services/geometricProbability';

@Component({
  selector: 'app-test-creation',
  templateUrl: './test-creation.component.html',
  styleUrls: ['./test-creation.component.scss'],
})
export class TestCreationComponent implements OnInit {
  gridCols: number = 3;
  times: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
  selectedTime: number = 5;

  isGamificationEnabled: boolean = false;

  isEasyEnabled: boolean = false;
  isMediumEnabled: boolean = false;
  isHardEnabled: boolean = false;

  easyCount: number = 0;
  mediumCount: number = 0;
  hardCount: number = 0;

  themes: { theme_id: number; theme_name: string; selected: boolean }[] = [];
  exercises: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private apiService: ApiService
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
      response => {
        this.themes = response.map((theme: any) => ({
          ...theme,
          selected: false,
        }));
      },
      error => console.error('Error fetching themes:', error)
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

    // Generate exercises
    const generatedEasy = binomialProbabilityRandom();
    const generatedMedium = hypergeometricProbabilityRandom();
    const generatedHard = geometricProbabilityRandom();

    const queryParams = `?easy=${this.easyCount}&medium=${this.mediumCount}&hard=${this.hardCount}&themes=${selectedThemes.join(',')}`;

    this.apiService.getExercises(queryParams).subscribe(
      response => {
        // Mix fetched and generated exercises
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

        // Combine all difficulty levels
        this.exercises = [...easy, ...medium, ...hard];

        if (this.exercises.length === 0) {
          alert('No exercises found to create a test.');
          return;
        }

        const writingTime = `00:${this.selectedTime.toString().padStart(2, '0')}:00`;
        this.apiService.createTest(this.exercises, writingTime).subscribe(
          testResponse => {
            this.router.navigate(['/test-writing'], {
              state: { data: this.exercises, timeLimit: writingTime, gamification: this.isGamificationEnabled },
            });
          },
          error => console.error('Error creating test:', error)
        );
      },
      error => console.error('Error fetching exercises:', error)
    );
  }

  mixExercises(fetched: any[], generated: any[], count: number): any[] {
    // Determine how many exercises to use from each source
    let fetchedCount = Math.min(fetched.length, Math.ceil(count / 2)); // Round up for fetched
    let generatedCount = count - fetchedCount; // Remainder for generated

    // Adjust if generated doesn't have enough exercises
    if (generatedCount > generated.length) {
      fetchedCount += generatedCount - generated.length;
      generatedCount = generated.length;
    }

    // Adjust if fetched doesn't have enough exercises
    if (fetchedCount > fetched.length) {
      generatedCount += fetchedCount - fetched.length;
      fetchedCount = fetched.length;
    }

    // Select the required number of exercises
    const selectedFetched = fetched.slice(0, fetchedCount);
    const selectedGenerated = generated.slice(0, generatedCount);

    // Combine and shuffle the exercises
    return this.shuffleArray([...selectedFetched, ...selectedGenerated]);
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
