import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from '../../services/api.services';
import { AdminService } from '../../services/admin.services';

@Component({
  selector: 'app-test-done',
  templateUrl: './test-done.component.html',
  styleUrls: ['./test-done.component.scss'],
})
export class TestDoneComponent implements OnInit {
  // Array to hold all test submissions
  tests: any[] = [];
  // Array for filtered tests (e.g., by search)
  filteredTests: any[] = [];
  // Array for current page data for the accordion view
  pagedTests: any[] = [];

  // Pagination parameters
  pageSize = 10;
  pageIndex = 0;

  // Search query for filtering tests (by test_id or submission_date)
  searchQuery: string = '';

  currentSortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  userOverallPercentile: number = 0;
  userId = '';

  constructor(
    private apiService: ApiService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    const userString = sessionStorage.getItem('user');
    if (userString) {
      const userObj = JSON.parse(userString);
      this.userId = userObj.userId;
    } else {
      this.userId = '';
    }
    this.fetchDataFromDatabase();
    this.apiService.getOverallPercentile(Number(this.userId)).subscribe(
      (response: any) => {
        this.userOverallPercentile = response.percentile;
      },
      error => {
        console.error('Error fetching overall percentile:', error);
      }
    );
  }

  fetchDataFromDatabase(): void {
    const userString = sessionStorage.getItem('user');
    if (userString) {
      const userObj = JSON.parse(userString);
      this.userId = userObj.userId;
    } else {
      this.userId = '';
    }
    this.apiService.getStatistics(Number(this.userId)).subscribe(
      (data: any[]) => {
        console.log('Test data:', data[0]);
        this.tests = data;
        this.filteredTests = [...this.tests];
        this.setPagedTests();
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  // Called when the search input changes
  onSearchChange(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredTests = [...this.tests];
    } else {
      this.filteredTests = this.tests.filter(
        test =>
          test.test_id?.toString().toLowerCase().includes(query) ||
          (test.submission_date && test.submission_date.toString().toLowerCase().includes(query))
      );
    }
    this.pageIndex = 0; // Reset to the first page after filtering
    this.setPagedTests();
  }

  // Handles paginator changes
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.setPagedTests();
  }

  // Sets the pagedTests array based on the current page and pageSize
  private setPagedTests(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedTests = this.filteredTests.slice(startIndex, endIndex);
  }

  sortData(column: string): void {
    // If the same column is clicked, toggle the sort direction
    if (this.currentSortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Otherwise, set new column and default to ascending order
      this.currentSortColumn = column;
      this.sortDirection = 'asc';
    }

    // Sort the filteredTests based on the selected column and direction
    this.filteredTests.sort((a, b) => {
      let aValue, bValue;
      switch (column) {
        case 'testId':
          aValue = a.test_id;
          bValue = b.test_id;
          break;
        case 'points':
          aValue = a.points_scored;
          bValue = b.points_scored;
          break;
        case 'date':
          aValue = new Date(a.submission_date).getTime();
          bValue = new Date(b.submission_date).getTime();
          break;
        default:
          return 0;
      }
      // For ascending order
      if (this.sortDirection === 'asc') {
        return aValue - bValue;
      }
      // For descending order
      return bValue - aValue;
    });

    // Reset to the first page after sorting
    this.pageIndex = 0;
    this.setPagedTests();
  }
}
