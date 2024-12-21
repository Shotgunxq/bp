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

  public rangeA: number = -2; // Start of range
  public rangeB: number = 2; // End of range
  public calculatedArea: number = 0;

  constructor() {
    this.updateTChart();
  }

  // Update chart when parameters change
  updateTChart() {
    const tData = this.calculateTDistribution(this.degreesOfFreedom);

    // Calculate area under the curve between rangeA and rangeB
    this.calculatedArea = this.calculateAreaUnderCurve(tData, this.rangeA, this.rangeB);

    this.tChartOptions = {
      series: [
        {
          name: 't-Distribution',
          data: tData.map(point => ({ x: parseFloat(point.x.toFixed(2)), y: parseFloat(point.y.toFixed(4)) })), // Clean x, y data
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        toolbar: { show: false },
      },
      markers: {
        size: this.showMarkers ? 5 : 0, // Toggle markers
        shape: 'circle',
      },
      xaxis: {
        title: { text: 't' },
        tickAmount: 8, // Reduce clutter on the x-axis
        labels: {
          rotate: 0,
          formatter: (value: string) => parseFloat(value).toFixed(1), // Round x-axis labels
        },
      },
      yaxis: {
        title: { text: 'f(t)' },
        min: 0,
      },
      annotations: {
        xaxis: [
          {
            x: this.rangeA,
            borderColor: '#FF4560',
            label: { text: `a = ${this.rangeA}` },
          },
          {
            x: this.rangeB,
            borderColor: '#FF4560',
            label: { text: `b = ${this.rangeB}` },
          },
        ],
      },
    };
  }

  // Calculate the Student's t-distribution data
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
    const step = 0.2; // Larger step to reduce clutter

    for (let t = -range; t <= range; t += step) {
      tData.push({ x: t, y: tPDF(t, degreesOfFreedom) });
    }

    return tData;
  }

  // Trapezoidal Rule for area calculation
  calculateAreaUnderCurve(data: { x: number; y: number }[], a: number, b: number): number {
    let area = 0;
    const filteredData = data.filter(point => point.x >= a && point.x <= b);

    for (let i = 0; i < filteredData.length - 1; i++) {
      const x1 = filteredData[i].x;
      const y1 = filteredData[i].y;
      const x2 = filteredData[i + 1].x;
      const y2 = filteredData[i + 1].y;

      area += ((y1 + y2) / 2) * (x2 - x1); // Trapezoidal rule
    }

    return parseFloat(area.toFixed(5));
  }
}
