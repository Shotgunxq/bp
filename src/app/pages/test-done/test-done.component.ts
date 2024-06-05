import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/apiServices';

@Component({
  selector: 'app-test-done',
  templateUrl: './test-done.component.html',
  styleUrls: ['./test-done.component.scss'],
})
export class TestDoneComponent implements AfterViewInit {
  displayedColumns: string[] = ['exercise_id', 'description', 'answer', 'difficulty'];
  dataSource = new MatTableDataSource<any>(); // Update the type if possible

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: ApiService) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.fetchDataFromDatabase();
  }

  // fetchDataFromDatabase() {
  //   // Call your API service to fetch data from the database
  //   this.apiService.fetchTestData().subscribe(
  //     (data: any[]) => {
  //       this.dataSource.data = data;
  //     },
  //     error => {
  //       console.error('Error fetching data:', error);
  //     }
  //   );
  // }
}
