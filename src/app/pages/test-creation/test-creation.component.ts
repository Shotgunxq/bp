import { Component, OnInit } from '@angular/core';
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
  generated: any[] = [];

  easyRandomNumber = Math.floor(Math.random() * 3) + 1;

  ngOnInit(): void {
    localStorage.clear();
  }
  times: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
  selectedTime: number = 5; // Default selected time

  isEasyEnabled: boolean = false;
  isMediumEnabled: boolean = false;
  isHardEnabled: boolean = false;

  exercises: any[] = [];

  exercisesKey: string = 'test-writing-exercises';

  constructor(
    private router: Router,
    private http: HttpClient,
    private apiService: ApiService
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

    const totalExerciseCount = parseInt(totalExerciseInput.value.trim(), 10) || 0;
    const easyCount = parseInt(easyCountInput.value.trim(), 10) || 0;
    const mediumCount = parseInt(mediumCountInput.value.trim(), 10) || 0;
    const hardCount = parseInt(hardCountInput.value.trim(), 10) || 0;

    return totalExerciseCount === easyCount + mediumCount + hardCount;
  }

  getData() {
    localStorage.clear();
    console.log('Getting data ', this.validateTotalExerciseCount());
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

    const adjustedEasyCount = Math.max(0, easyCount - this.easyRandomNumber);

    const queryParams = `?easy=${adjustedEasyCount}&medium=${mediumCount}&hard=${hardCount}`;

    const generatedBinominal = binomialProbabilityRandom();
    const generatedHypergeometric = hypergeometricProbabilityRandom();
    const generatedGeometric = geometricProbabilityRandom();

    switch (this.easyRandomNumber) {
      case 1:
        this.generated = generatedBinominal;
        break;
      case 2:
        this.generated = [...generatedBinominal, ...generatedHypergeometric];
        break;
      case 3:
        this.generated = [...generatedBinominal, ...generatedHypergeometric, ...generatedGeometric];
        break;
    }

    this.apiService.getExercises(queryParams).subscribe(
      response => {
        // Assign the response data directly to the exercises property
        this.exercises = response.exercises;
        // Merge the fetched and generated exercises

        this.exercises = this.exercises.concat(this.generated);
        console.log('Exercises fetched:', this.exercises);
        console.log('Generated:', this.generated);
        if (this.exercises.length === 0) {
          console.error('No exercises to create a test.');
          return;
        }

        const cas_na_pisanie = `00:${this.selectedTime.toString().padStart(2, '0')}:00`;

        console.log('Time:', cas_na_pisanie);
        this.apiService.createTest(this.exercises, cas_na_pisanie).subscribe(
          testResponse => {
            console.log('Test created:', testResponse);
            this.router.navigate(['/test-writing'], {
              state: { data: this.exercises, timeLimit: cas_na_pisanie },
            });
          },
          error => {
            console.error('Error creating test:', error);
          }
        );
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  // initializeExercises(): void {
  //   const generatedExercisesBinominal: binomialExercise[] = binomialProbabilityRandom();
  //   const generatedExercisesHypergeometric: hypergeometricExercises[] = hypergeometricProbabilityRandom();
  //   const generatedExercisesGeometric: geometricExercise[] = geometricProbabilityRandom();

  //   this.generated = [...generatedExercisesBinominal, ...generatedExercisesHypergeometric, ...generatedExercisesGeometric];

  //   localStorage.setItem(this.exercisesKey, JSON.stringify(this.generated));
  // }
}
