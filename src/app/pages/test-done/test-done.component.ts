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
  displayedColumns: string[] = ['test_id', 'exercises', 'cas_na_pisanie', 'created_at']; // Adjust columns as needed
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  testId: number = 1; // Retrieve dynamically as needed

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchDataFromDatabase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchDataFromDatabase() {
    this.apiService.fetchTestData(this.testId).subscribe(
      (data: any) => {
        this.dataSource.data = [data]; // Set data as an array of one item
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
