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
      const chartData = data.map((item: { test_id: any; avg_score: string }) => ({
        // for now just use the id as the label
        x: `Test ${item.test_id}`,
        // convert the string to a number
        y: parseFloat(item.avg_score),
      }));
      this.avgPercentageChartOptions = {
        series: [{ name: 'Average Score', data: chartData }],
        chart: { type: 'bar', height: 350 },
        xaxis: { title: { text: 'Test' } },
        yaxis: { title: { text: 'Average Score' } },
      };
    });
  }
  loadAvgPointsPerExercise() {
    this.adminService.getAvgPointsPerExercise().subscribe(raw => {
      const chartData = raw
        // drop any tests where avg_points_per_exercise is null
        .filter((item: { avg_points_per_exercise: null }) => item.avg_points_per_exercise !== null)
        .map((item: { test_id: any; avg_points_per_exercise: any }) => ({
          x: `Test ${item.test_id}`,
          y: parseFloat(item.avg_points_per_exercise as any),
        }));

      this.avgPointsChartOptions = {
        series: [{ name: 'Avg Points per Exercise', data: chartData }],
        chart: { type: 'bar', height: 350 },
        xaxis: { title: { text: 'Test' } },
        yaxis: { title: { text: 'Avg Points/exercise' } },
      };
    });
  }

  loadLeaderboard() {
    this.adminService.getLeaderboard().subscribe(raw => {
      const chartData = raw.map(item => ({
        x: item.username, // from `u.email AS username`
        y: typeof item.total_points === 'string' ? parseFloat(item.total_points) : item.total_points,
      }));

      this.leaderboardChartOptions = {
        series: [
          {
            name: 'Total Points',
            data: chartData,
          },
        ],
        chart: { type: 'bar', height: 350 },
        xaxis: { title: { text: 'User' } },
        yaxis: { title: { text: 'Total Points' } },
      };
    });
  }
}
