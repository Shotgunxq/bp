import { Component } from "@angular/core";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: 'app-test-creation',
  templateUrl: './test-creation.component.html',
  styleUrl: './test-creation.component.scss',
})
export class TestCreationComponent {
  constructor(private http: HttpClient) {}

  getData() {
    this.http.get<any>("http://localhost:3000/test/api").subscribe(
      (response) => {
        console.log("Data:", response);
        // Process the data here
      },
      (error) => {
        console.error("Error fetching data:", error);
      },
    );
  }
}
