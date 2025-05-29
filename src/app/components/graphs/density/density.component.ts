import { Component } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexDataLabels } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'graph-density',
  templateUrl: './density.component.html',
  styleUrls: ['./density.component.scss'],
})
export class DensityComponent {
  public densityChartOptions!: Partial<ChartOptions>;
  public showDataLabels = true; // Toggle for data labels

  public mean = 0; // Default mean
  public stdDev = 1; // Default standard deviation

  constructor() {
    this.updateDensityChart();
  }

  // Toggle data labels visibility
  toggleDataLabels() {
    this.densityChartOptions.dataLabels = {
      enabled: this.showDataLabels,
    };
  }

  // Update density chart
  updateDensityChart() {
    const densityData = this.calculateNormalDensity(this.mean, this.stdDev);
    const range = 4 * this.stdDev; // Display range ±4σ

    this.densityChartOptions = {
      series: [
        {
          name: 'f_X(x)',
          data: densityData.map(point => ({ x: point.x, y: point.y })),
        },
      ],
      chart: {
        height: 350,
        type: 'area', // Area chart for smooth curve
        toolbar: { show: false },
      },
      dataLabels: {
        enabled: this.showDataLabels, // Control visibility dynamically
        style: {
          fontSize: '12px',
          colors: ['#304758'],
        },
        formatter: (val: number) => val.toFixed(2),
      },
      xaxis: {
        type: 'numeric', // Numeric x-axis for smooth distribution
        title: { text: 'x' },
        min: this.mean - range,
        max: this.mean + range,
        // Setting tickAmount to 9 gives evenly spaced ticks (e.g., -4, -3, …, 3, 4 when mean = 0 and stdDev = 1)
        tickAmount: 9,
        labels: {
          formatter: val => parseFloat(val).toFixed(1),
        },
      },
      yaxis: {
        title: { text: 'f_X(x)' },
        min: 0,
        labels: {
          formatter: value => value.toFixed(3),
        },
      },
    };
  }

  // Calculate normal distribution density
  calculateNormalDensity(mean: number, stdDev: number): { x: number; y: number }[] {
    const densityData = [];
    const normalDensity = (x: number, mean: number, stdDev: number): number => {
      return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    };

    const range = 4 * stdDev; // Display range ±4σ
    const step = 0.1;

    for (let x = mean - range; x <= mean + range; x += step) {
      const y = normalDensity(x, mean, stdDev);
      if (y < 0.0001) continue; // Ignore negligible values
      densityData.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(4)) });
    }

    return densityData;
  }
}
