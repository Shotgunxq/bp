import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../../services/adminServices';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-stats-table',
  templateUrl: './admin-stats-table.component.html',
  styleUrls: ['./admin-stats-table.component.scss'],
})
export class StatisticsComponent implements OnInit {
  // Full data received from the service.
  statisticsData: any[] = [];

  // Data to be displayed on the current page after filtering.
  pagedStatisticsData: any[] = [];

  // Search string bound to the search input.
  searchQuery: string = '';

  // The length of the filtered data (used for paginator length)
  filteredDataLength: number = 0;

  // Pagination settings.
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private http: HttpClient,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.adminService.getStatistics().subscribe(
      data => {
        // Filter out rows without a full_name property.
        this.statisticsData = data.filter((row: { full_name: any }) => row.full_name);
        console.log('Statistics data:', this.statisticsData);
        this.updatePagedData();
      },
      error => {
        console.error('Error fetching statistics:', error);
      }
    );
  }

  /**
   * Called when the paginator emits a page change event.
   */
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedData();
  }

  /**
   * Called whenever the search query changes.
   * Resets the current page and updates the displayed data.
   */
  onSearchChange() {
    this.pageIndex = 0; // Reset to first page
    this.updatePagedData();
  }

  /**
   * Filters statisticsData based on the search query (by name or date),
   * then updates pagedStatisticsData according to the current pagination.
   */
  updatePagedData() {
    let filteredData = this.statisticsData;
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filteredData = filteredData.filter(item => {
        const nameMatches = item.full_name.toLowerCase().includes(query);
        const dateMatches = item.submission_date && item.submission_date.toLowerCase().includes(query);
        const exerciseMatches =
          item.test_exercises &&
          item.test_exercises.some((ex: { description: string }) => ex.description && ex.description.toLowerCase().includes(query));
        return nameMatches || dateMatches || exerciseMatches;
      });
    }
    // Update the paginator length.
    this.filteredDataLength = filteredData.length;

    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedStatisticsData = filteredData.slice(startIndex, endIndex);
  }
}
