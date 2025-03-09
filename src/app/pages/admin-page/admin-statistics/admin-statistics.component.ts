import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/adminServices';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.scss'],
})
export class AdminStatisticsComponent implements OnInit {
  submissionsChartOptions: Partial<ChartOptions> = {};
  avgPercentageChartOptions: Partial<ChartOptions> = {};
  avgPointsChartOptions: Partial<ChartOptions> = {};

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadSubmissionsOverTime();
    this.loadAvgPercentageScores();
    this.loadAvgPointsPerExercise();
  }

  loadSubmissionsOverTime() {
    this.adminService.getSubmissionsOverTime().subscribe(data => {
      // Expected format: [{ submission_date: '2025-01-01', total_submissions: 10 }, ...]
      const chartData = data.map((item: { submission_date: string; total_submissions: number }) => ({
        x: new Date(item.submission_date),
        y: item.total_submissions,
      }));
      this.submissionsChartOptions = {
        series: [{ name: 'Submissions', data: chartData }],
        chart: { type: 'line', height: 350 },
        xaxis: { type: 'datetime', title: { text: 'Date' } },
        yaxis: { title: { text: 'Submissions' } },
      };
    });
  }

  loadAvgPercentageScores() {
    this.adminService.getAvgPercentageScores().subscribe(data => {
      // Expected format: [{ test_name: 'Test A', avg_percentage: 78.5 }, ...]
      const chartData = data.map((item: { test_name: string; avg_percentage: number }) => ({
        x: item.test_name,
        y: item.avg_percentage,
      }));
      this.avgPercentageChartOptions = {
        series: [{ name: 'Average % Score', data: chartData }],
        chart: { type: 'bar', height: 350 },
        xaxis: { title: { text: 'Test' } },
        yaxis: { title: { text: 'Average % Score' } },
      };
    });
  }

  loadAvgPointsPerExercise() {
    this.adminService.getAvgPointsPerExercise().subscribe(data => {
      // Expected format: [{ test_name: 'Test A', avg_points_per_exercise: 4.5 }, ...]
      const chartData = data.map((item: { test_name: string; avg_points_per_exercise: number }) => ({
        x: item.test_name,
        y: item.avg_points_per_exercise,
      }));
      this.avgPointsChartOptions = {
        series: [{ name: 'Avg Points per Exercise', data: chartData }],
        // Use a bar chart since we only have one numeric value per test
        chart: { type: 'boxPlot', height: 350 },
        xaxis: { title: { text: 'Test' } },
        yaxis: { title: { text: 'Average Points per Exercise' } },
      };
    });
  }
}
