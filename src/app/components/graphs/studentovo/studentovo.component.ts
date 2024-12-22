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

    // Log data for debugging
    console.log('Generated t-Distribution Data:', tData);

    // Calculate area under the curve between rangeA and rangeB
    this.calculatedArea = this.calculateAreaUnderCurve(tData, this.rangeA, this.rangeB);

    const annotations = [
      {
        x: this.rangeA,
        borderColor: '#00E396',
        label: { text: `a = ${this.rangeA}` },
      },
      {
        x: this.rangeB,
        borderColor: '#775DD0',
        label: { text: `b = ${this.rangeB}` },
      },
    ];

    this.tChartOptions = {
      series: [
        {
          name: 't-Distribution',
          data: tData.map(point => ({ x: point.x, y: point.y })), // Properly map x, y
        },
      ],
      chart: {
        height: 350,
        type: 'line', // Use line chart type for connecting points
        toolbar: { show: false },
      },
      markers: {
        size: this.showMarkers ? 5 : 0,
        shape: 'circle',
      },
      xaxis: {
        type: 'numeric', // Ensure numeric x-axis
        title: { text: 't' },
        tickAmount: 10, // Adjust number of ticks
        labels: {
          formatter: val => parseFloat(val).toFixed(1), // Format x-axis labels
        },
      },
      yaxis: {
        title: { text: 'f(t)' },
        min: 0,
      },
      annotations: {
        xaxis: annotations,
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
    const step = 0.1; // Use consistent step size

    for (let t = -range; t <= range; t += step) {
      const x = parseFloat(t.toFixed(1)); // Ensure proper x values
      const y = parseFloat(tPDF(t, degreesOfFreedom).toFixed(4)); // Ensure proper y values
      tData.push({ x, y });
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
