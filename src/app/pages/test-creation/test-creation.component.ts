import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Exercise, binomialProbabilityRandom } from '../../services/binomialProbability';
// const result: BinomialResult = binomialProbabilityRandom();
// console.log(`Počet opakovaní: ${result.n}`);
// console.log(`Počet úspechov: ${result.k}`);
// console.log(`Pravdepodobnosť úspechu: ${result.p}`);
// console.log(
//   `Pravdepodobnosť získania presne ${result.k} hláv pri ${result.n} hodoch mincí je ${result.probability}`,
// );
@Component({
  selector: 'app-test-creation',
  templateUrl: './test-creation.component.html',
  styleUrl: './test-creation.component.scss',
})
export class TestCreationComponent {
  times: number[] = [5, 10, 13, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
  selectedTime: number = 5; // Default selected time

  isEasyEnabled: boolean = false;
  isMediumEnabled: boolean = false;
  isHardEnabled: boolean = false;

  easyExercises: any[] = [];
  mediumExercises: any[] = [];
  hardExercises: any[] = [];

  generatedExercises: Exercise[] = []; // Property to hold generated exercises

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  preventNegativeValue(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value && parseInt(input.value, 10) < 0) {
      input.value = '0';
    }
  }

  validateTime(): boolean {
    return this.selectedTime >= 5 && this.selectedTime <= 60;
  }

  validateTotalExerciseCount(): boolean {
    const totalExerciseInput = document.getElementById('totalExerciseCount') as HTMLInputElement;
    const easyCountInput = document.getElementById('easyCount') as HTMLInputElement;
    const mediumCountInput = document.getElementById('mediumCount') as HTMLInputElement;
    const hardCountInput = document.getElementById('hardCount') as HTMLInputElement;

    // Parse inputs to integers or treat them as zero if empty or invalid
    const totalExerciseCount = parseInt(totalExerciseInput.value.trim(), 10) || 0;
    const easyCount = parseInt(easyCountInput.value.trim(), 10) || 0;
    const mediumCount = parseInt(mediumCountInput.value.trim(), 10) || 0;
    const hardCount = parseInt(hardCountInput.value.trim(), 10) || 0;

    return totalExerciseCount === easyCount + mediumCount + hardCount;
  }

  getData() {
    if (!this.validateTotalExerciseCount()) {
      console.error('Total exercise count does not match the sum of easy, medium, and hard exercises.');
      return;
    }
    const easyCountInput = document.getElementById('easyCount') as HTMLInputElement;
    const mediumCountInput = document.getElementById('mediumCount') as HTMLInputElement;
    const hardCountInput = document.getElementById('hardCount') as HTMLInputElement;

    const easyCount = easyCountInput.value === '' ? 0 : parseInt(easyCountInput.value, 10);
    const mediumCount = mediumCountInput.value === '' ? 0 : parseInt(mediumCountInput.value, 10);
    const hardCount = hardCountInput.value === '' ? 0 : parseInt(hardCountInput.value, 10);

    const queryParams = `?easy=${easyCount}&medium=${mediumCount}&hard=${hardCount}`;

    // const generatedExercises: Exercise[] = binomialProbabilityRandom();
    // console.log('Generated exercises:', generatedExercises);

    this.http.get<any>('http://localhost:3000/test/api' + queryParams).subscribe(
      response => {
        // console.log('Data fetched from DB:', response);
        this.easyExercises = response.easy;
        this.mediumExercises = response.medium;
        this.hardExercises = response.hard;

        // Generate exercises using binomial probability

        // Combine generated exercises with fetched exercises
        // this.easyExercises = this.easyExercises.concat(generatedExercises);
        // console.log('Merged data (generated and fetched): ', this.easyExercises);
        // this.mediumExercises.push(...generatedExercises.medium);
        // this.hardExercises.push(...generatedExercises.hard);
        this.router.navigate(['/test-writing'], {
          state: { data: response },
        });
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
