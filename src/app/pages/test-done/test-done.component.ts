import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from '../../services/apiServices';
import { AdminService } from '../../services/adminServices';

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

  constructor(
    private apiService: ApiService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.fetchDataFromDatabase();
  }

  fetchDataFromDatabase(): void {
    // Hardcode userId=1 for now (replace with your actual logic as needed)
    const userId = 1;
    this.apiService.getStatistics(userId).subscribe(
      (data: any[]) => {
        console.log('Test data:', data[0].testId);
        // Backend already returns tests for the correct user, so no need to filter here
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
}
