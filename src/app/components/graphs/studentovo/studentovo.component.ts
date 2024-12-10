import { Component } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexMarkers, ApexAnnotations } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  markers?: ApexMarkers;
  annotations?: ApexAnnotations;
};

@Component({
  selector: 'graph-studentovo',
  templateUrl: './studentovo.component.html',
  styleUrls: ['./studentovo.component.scss'],
})
export class StudentovoComponent {
  public tChartOptions!: Partial<ChartOptions>;
  public degreesOfFreedom: number = 10; // Default degrees of freedom
  public showMarkers: boolean = true;

  constructor() {
    this.updateTChart();
  }

  // Update the chart when parameters change
  updateTChart() {
    const tData = this.calculateTDistribution(this.degreesOfFreedom);

    this.tChartOptions = {
      series: [
        {
          name: 't-Distribution',
          data: tData.map(point => point.y),
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
        categories: tData.map(point => point.x.toFixed(2)), // Display x-values
        title: {
          text: 't',
        },
      },
      yaxis: {
        title: {
          text: 'f(t)',
        },
        min: 0,
      },
    };
  }

  // Calculate the t-distribution data
  calculateTDistribution(degreesOfFreedom: number): { x: number; y: number }[] {
    const gamma = (z: number): number => {
      if (z === 1) return 1;
      if (z === 0.5) return Math.sqrt(Math.PI);
      return (z - 1) * gamma(z - 1);
    };

    const tPDF = (t: number, df: number): number => {
      const numerator = gamma((df + 1) / 2);
      const denominator = Math.sqrt(df * Math.PI) * gamma(df / 2);
      return (numerator / denominator) * Math.pow(1 + (t * t) / df, -(df + 1) / 2);
    };

    const tData = [];
    const range = 4; // Range for t-values (-4 to 4)
    const step = 0.1;

    for (let t = -range; t <= range; t += step) {
      tData.push({ x: t, y: tPDF(t, degreesOfFreedom) });
    }

    return tData;
  }
}
