import { Component } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexAnnotations,
  ApexDataLabels,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  annotations?: ApexAnnotations;
  // Add this line
  dataLabels: ApexDataLabels; // Add this line
  // regions?: ApexAnnotations;
};
@Component({
  selector: 'graph-distribution',
  templateUrl: './distribution.component.html',
  styleUrl: './distribution.component.scss',
})
export class DistributionComponent {
  public n = 10;
  public p = 0.5;
  public chartOptions!: Partial<ChartOptions>;

  constructor() {
    this.updateBinomialChart();
  }
  updateBinomialChart() {
    const data = [];
    const binomialCoefficient = (n: number, k: number): number => {
      let coeff = 1;
      for (let i = 0; i < k; i++) {
        coeff *= (n - i) / (i + 1);
      }
      return coeff;
    };

    const cumulativeDistribution = (k: number): number => {
      let sum = 0;
      for (let i = 0; i <= k; i++) {
        sum += binomialCoefficient(this.n, i) * Math.pow(this.p, i) * Math.pow(1 - this.p, this.n - i);
      }
      return parseFloat(sum.toFixed(2)); // Round to 2 decimal places
    };

    for (let k = 0; k <= this.n; k++) {
      data.push({ x: k, y: cumulativeDistribution(k) });
    }

    this.chartOptions = {
      series: [
        {
          name: 'F_X(k)',
          data: data.map(point => point.y),
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      title: {
        text: 'Distribučná Funkcia Binomického Rozdelenia',
        align: 'center',
      },
      xaxis: {
        categories: data.map(point => point.x.toString()),
        title: {
          text: 'k',
        },
      },
      yaxis: {
        title: {
          text: 'F_X(k)',
        },
        min: 0,
        max: 1,
      },
    };
  }
}
