import { Component } from "@angular/core";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
@Component({
  selector: "app-test-creation",
  templateUrl: "./test-creation.component.html",
  styleUrl: "./test-creation.component.scss",
})
export class TestCreationComponent {
  isEasyEnabled: boolean = false;
  isMediumEnabled: boolean = false;
  isHardEnabled: boolean = false;

  easyExercises: any[] = [];
  mediumExercises: any[] = [];
  hardExercises: any[] = [];

  preventNegativeValue(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value && parseInt(input.value, 10) < 0) {
      input.value = "0";
    }
  }

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  getData() {
    const easyCountInput = document.getElementById(
      "easyCount",
    ) as HTMLInputElement;
    const mediumCountInput = document.getElementById(
      "mediumCount",
    ) as HTMLInputElement;
    const hardCountInput = document.getElementById(
      "hardCount",
    ) as HTMLInputElement;

    const easyCount =
      easyCountInput.value === "" ? 0 : parseInt(easyCountInput.value, 10);
    const mediumCount =
      mediumCountInput.value === "" ? 0 : parseInt(mediumCountInput.value, 10);
    const hardCount =
      hardCountInput.value === "" ? 0 : parseInt(hardCountInput.value, 10);

    const queryParams = `?easy=${easyCount}&medium=${mediumCount}&hard=${hardCount}`;

    this.http
      .get<any>("http://localhost:3000/test/api" + queryParams)
      .subscribe(
        (response) => {
          console.log("Data:", response);
          this.easyExercises = response.easy;
          this.mediumExercises = response.medium;
          this.hardExercises = response.hard;
          this.router.navigate(["/test-writing"], {
            state: { data: response },
          });
        },
        (error) => {
          console.error("Error fetching data:", error);
        },
      );
  }
}