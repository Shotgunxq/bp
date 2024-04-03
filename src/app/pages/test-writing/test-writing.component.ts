import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-test-writing',
  templateUrl: './test-writing.component.html',
  styleUrl: './test-writing.component.scss',
  
})
export class TestWritingComponent {
  constructor(private http: HttpClient) {}

  getData() {
    this.http.get('/test').subscribe((response) => {
      // console.log('Data:', response);
      // Process the data here
    }, (error) => {
      console.error('Error fetching data:', error);
    });
  }
}
