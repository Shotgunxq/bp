import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../../services/adminServices';
@Component({
  selector: 'app-admin-stats-table',
  templateUrl: './admin-stats-table.component.html',
  styleUrl: './admin-stats-table.component.scss',
})
export class StatisticsComponent implements OnInit {
  statisticsData: any[] = [];
  displayedColumns: string[] = ['full_name', 'points_scored', 'max_points', 'submission_date'];
  expandedElement: any | null = null;

  constructor(
    private http: HttpClient,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics(): void {
    this.adminService.getStatistics().subscribe(
      data => {
        this.statisticsData = data;
        console.log('Statistics data:', this.statisticsData);
      },
      error => {
        console.error('Error fetching statistics:', error);
      }
    );
  }

  toggleAccordion(row: any): void {
    // Toggle the expansion for the selected row
    this.expandedElement = this.expandedElement === row ? null : row;
  }
}
