import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../services/apiServices';

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

    const adjustedEasyCount = Math.max(0, easyCount - 3); // Ensure the count does not go below zero
    // var queryParams = '';

    // if (easyCount > 0) {
    //   queryParams += `?easy=${adjustedEasyCount}`;
    //   if (mediumCount > 0) {
    //     queryParams += `&medium=${mediumCount}`;
    //     if (hardCount > 0) {
    //       queryParams += `&hard=${hardCount}`;
    //     }
    //   }
    // } else {
    //   console.error('No exercises selected.');
    // }

    const queryParams = `?easy=${adjustedEasyCount}&medium=${mediumCount}&hard=${hardCount}`;

    this.apiService.getExercises(queryParams).subscribe(
      response => {
        this.easyExercises = response.easy || [];
        this.mediumExercises = response.medium || [];
        this.hardExercises = response.hard || [];

        // Filter exercises and map to task IDs only if the corresponding count is greater than zero
        const tasks_id = [
          ...this.easyExercises.filter(() => easyCount > 0),
          ...this.mediumExercises.filter(() => mediumCount > 0),
          ...this.hardExercises.filter(() => hardCount > 0),
        ].map(e => e.task_id);

        if (tasks_id.length === 0) {
          console.error('No tasks to create a test.');
          return;
        }
        console.log('Tasks ID:', tasks_id);
        console.log('Response:', response);

        const cas_na_pisanie = '00:' + this.selectedTime + ':00';

        console.log('Time:', cas_na_pisanie);
        this.apiService.createTest(tasks_id, cas_na_pisanie).subscribe(
          testResponse => {
            console.log('Test created:', testResponse);
            this.router.navigate(['/test-writing'], {
              state: { data: response },
            });
          },
          error => {
            console.error('Error creating test:', error);
          }
        );

        // this.router.navigate(['/test-writing'], {
        //   state: { data: response },
        // });
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
