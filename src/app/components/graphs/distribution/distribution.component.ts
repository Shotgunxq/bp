import { Component } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ApexYAxis } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'graph-distribution',
  templateUrl: './distribution.component.html',
  styleUrl: './distribution.component.scss',
})
export class DistributionComponent {
  public chartOptions!: Partial<ChartOptions>;
  public n: number = 10; // Default number of trials
  public p: number = 0.5; // Default probability of success

  constructor() {
    this.updateBinomialChart();
  }

  updateBinomialChart() {
    const binomialData = this.calculateBinomialData(this.n, this.p);

    this.chartOptions = {
      series: [
        {
          name: 'P(X = x)',
          data: binomialData.map(point => point.y),
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        toolbar: { show: false },
      },
      title: {
        text: 'Binomické rozdelenie',
        align: 'center',
      },
      xaxis: {
        categories: binomialData.map(point => point.x.toString()),
        title: { text: 'x (Úspechy)' },
      },
      yaxis: {
        title: { text: 'P(X = x)' },
        min: 0,
        labels: {
          formatter: (value: number) => value.toFixed(3),
        },
      },
    };
  }

  calculateBinomialData(n: number, p: number): { x: number; y: number }[] {
    const binomialData = [];
    for (let x = 0; x <= n; x++) {
      const probability = (this.factorial(n) / (this.factorial(x) * this.factorial(n - x))) * Math.pow(p, x) * Math.pow(1 - p, n - x);
      binomialData.push({ x, y: parseFloat(probability.toFixed(5)) });
    }
    return binomialData;
  }

  factorial(num: number): number {
    return num <= 1 ? 1 : num * this.factorial(num - 1);
  }
}
