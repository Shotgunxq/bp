import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.services';
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
  leaderboardChartOptions: Partial<ChartOptions> = {};

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadSubmissionsOverTime();
    this.loadAvgPercentageScores();
    this.loadAvgPointsPerExercise();
    this.loadLeaderboard();
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

  loadLeaderboard() {
    this.adminService.getLeaderboard().subscribe(data => {
      // Expected format: [{ username: 'Alice', total_points: 120 }, { username: 'Bob', total_points: 100 }, ...]
      const chartData = data.map((item: { username: string; total_points: number }) => ({
        x: item.username,
        y: item.total_points,
      }));
      this.leaderboardChartOptions = {
        series: [{ name: 'Total Points', data: chartData }],
        chart: { type: 'bar', height: 350 },
        xaxis: { title: { text: 'User' } },
        yaxis: { title: { text: 'Total Points' } },
      };
    });
  }
}
