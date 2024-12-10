import { Component } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexMarkers } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  markers?: ApexMarkers;
};
@Component({
  selector: 'graph-chikvadrant',
  templateUrl: './chikvadrant.component.html',
  styleUrl: './chikvadrant.component.scss',
})
export class ChikvadrantComponent {
  public chiChartOptions!: Partial<ChartOptions>;
  public degreesOfFreedom: number = 4; // Default degrees of freedom
  public showMarkers: boolean = true;

  constructor() {
    this.updateChiChart();
  }

  // Update the chart when parameters change
  updateChiChart() {
    const chiData = this.calculateChiSquared(this.degreesOfFreedom);

    this.chiChartOptions = {
      series: [
        {
          name: 'Chi-Squared Distribution',
          data: chiData.map(point => point.y),
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      markers: {
        size: this.showMarkers ? 5 : 0, // Toggle markers
        shape: 'circle',
      },
      xaxis: {
        categories: chiData.map(point => point.x.toFixed(2)), // Display x-values
        title: {
          text: 'x',
        },
      },
      yaxis: {
        title: {
          text: 'f(x)',
        },
        min: 0,
      },
    };
  }

  // Calculate the Chi-Squared data points
  calculateChiSquared(degreesOfFreedom: number): { x: number; y: number }[] {
    const gamma = (z: number): number => {
      if (z === 1) return 1;
      if (z === 0.5) return Math.sqrt(Math.PI);
      return (z - 1) * gamma(z - 1);
    };

    const chiPDF = (x: number, df: number): number => {
      if (x <= 0) return 0;
      const k = df / 2;
      const numerator = Math.pow(x, k - 1) * Math.exp(-x / 2);
      const denominator = Math.pow(2, k) * gamma(k);
      return numerator / denominator;
    };

    const chiData = [];
    const maxRange = 20; // Maximum x value for the plot
    const step = 0.1;

    for (let x = 0; x <= maxRange; x += step) {
      chiData.push({ x, y: chiPDF(x, degreesOfFreedom) });
    }

    return chiData;
  }
}
