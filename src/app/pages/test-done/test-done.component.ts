import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/apiServices';

@Component({
  selector: 'app-test-done',
  templateUrl: './test-done.component.html',
  styleUrls: ['./test-done.component.scss'],
})
export class TestDoneComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['exercise_id', 'description', 'answer', 'difficulty', 'points', 'timestamp'];
  dataSource = new MatTableDataSource<any>(); // Update the type if possible
  testId: number = 51; // You should get this value from route params or some other source

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchDataFromDatabase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchDataFromDatabase() {
    this.apiService.fetchTestData(this.testId).subscribe(
      (data: any[]) => {
        this.dataSource.data = data;
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
