import { Component } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexTitleSubtitle, ApexAnnotations, ApexMarkers } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  annotations?: ApexAnnotations;
  markers?: ApexMarkers;
};

@Component({
  selector: 'graph-poisson',
  templateUrl: './poisson.component.html',
  styleUrls: ['./poisson.component.scss'],
})
export class PoissonComponent {
  public poissonChartOptions!: Partial<ChartOptions>;
  public lambda: number = 3; // Default λ
  public rangeA: number = 1; // Start of range
  public rangeB: number = 5; // End of range
  public calculatedArea: number = 0; // Area under the curve
  public showMarkers: boolean = true; // Toggle for markers visibility

  constructor() {
    this.updatePoissonChart();
  }

  // Update the chart dynamically
  updatePoissonChart() {
    const poissonData = this.calculatePoissonData(this.lambda);

    // Calculate area between rangeA and rangeB
    this.calculatedArea = this.calculateAreaUnderCurve(poissonData, this.rangeA, this.rangeB);

    const annotations = [
      {
        x: this.rangeA, // Start of the range
        x2: this.rangeB, // End of the range
        fillColor: 'rgba(0, 123, 255, 0.2)', // Semi-transparent fill color
        opacity: 0.5, // Opacity of the fill
      },
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

    this.poissonChartOptions = {
      series: [
        {
          name: 'P(X = x)',
          data: poissonData.map(point => ({ x: point.x, y: point.y })), // Properly map x, y
        },
      ],
      chart: {
        height: 350,
        type: 'line', // Line chart type
        toolbar: {
          show: false,
        },
      },
      markers: {
        size: this.showMarkers ? 5 : 0, // Dynamically toggle marker size
      },
      xaxis: {
        type: 'numeric', // Use numeric x-axis
        title: { text: 'x (Occurrences)' },
        tickAmount: 20, // Adjust ticks for readability
        labels: {
          formatter: val => parseFloat(val).toFixed(0), // Format x-axis labels as integers
        },
      },
      yaxis: {
        title: {
          text: 'P(X = x)',
        },
        min: 0,
        labels: {
          formatter: (value: number) => value.toFixed(5), // Round y-axis values to 5 decimals
        },
      },
      annotations: {
        xaxis: annotations,
      },
    };
  }

  // Calculate Poisson distribution data points
  calculatePoissonData(lambda: number): { x: number; y: number }[] {
    const poissonData = [];
    const maxRange = 40; // Increase the maximum x value for more points
    const step = 0.1; // Reduce step size for finer granularity

    for (let x = 0; x <= maxRange; x += step) {
      const probability = (Math.pow(lambda, Math.floor(x)) * Math.exp(-lambda)) / this.factorial(Math.floor(x));
      if (probability < 0.001) break; // Stop when probabilities are negligible
      poissonData.push({ x: parseFloat(x.toFixed(5)), y: parseFloat(probability.toFixed(5)) });
    }

    // for (let x = 0; x <= maxRange; x++) {
    //   const probability = (Math.pow(lambda, x) * Math.exp(-lambda)) / this.factorial(x);
    //   if (probability < 0.0001) break; // Stop when probabilities are negligible
    //   poissonData.push({ x, y: parseFloat(probability.toFixed(5)) });
    // }
    return poissonData;
  }

  // Calculate the factorial of a number
  factorial(n: number): number {
    return n <= 1 ? 1 : n * this.factorial(n - 1);
  }

  // Calculate area under the curve using the trapezoidal rule
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
