import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../../services/adminServices';

@Component({
  selector: 'app-admin-stats-table',
  templateUrl: './admin-stats-table.component.html',
  styleUrls: ['./admin-stats-table.component.scss'], // Note plural "styleUrls"
})
export class StatisticsComponent implements OnInit {
  statisticsData: any[] = [];
  displayedColumns: string[] = ['full_name', 'points_scored', 'max_points', 'submission_date'];
  expandedElement: any | null = null;
  isDataRow = (index: number, row: any) => !row.hasOwnProperty('detailRow');
  isDetailRow = (index: number, row: any) => row.hasOwnProperty('detailRow');

  constructor(
    private http: HttpClient,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.adminService.getStatistics().subscribe(
      data => {
        // Transform the data into an alternating array of data row and detail row
        // Example: Filter out rows that do not have a full_name

        this.statisticsData = this.addDetailRows(data);
        this.statisticsData = this.statisticsData.filter(row => row.full_name);
        console.log('Transformed statistics data:', this.statisticsData);
      },
      error => {
        console.error('Error fetching statistics:', error);
      }
    );
  }

  /**
   * For each item in the data array, push the item itself (data row)
   * and then push an extra object that indicates a detail row.
   */
  addDetailRows(data: any[]): any[] {
    return data.reduce((acc, row) => {
      acc.push(row);
      acc.push({ detailRow: true, element: row });
      return acc;
    }, []);
  }
}
