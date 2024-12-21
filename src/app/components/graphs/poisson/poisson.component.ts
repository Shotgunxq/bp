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
  public highlightX: number = 2; // Default highlight value
  public rangeA: number = 1; // Start of range
  public rangeB: number = 5; // End of range
  public calculatedArea: number = 0; // Area under the curve
  public showHighlight: boolean = true; // Toggle for highlighting
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
      ...(this.showHighlight
        ? [
            {
              x: this.highlightX,
              borderColor: '#FF4560',
              strokeDashArray: 10,
              label: {
                text: `P(X = ${this.highlightX})`,
                style: {
                  background: '#FF4560',
                  color: '#fff',
                },
              },
            },
          ]
        : []),
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
          data: poissonData.map(point => point.y),
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
        size: this.showMarkers ? 5 : 0, // Dynamically toggle marker size
      },
      xaxis: {
        type: 'numeric', // Use numeric x-axis
        title: {
          text: 'x (Occurrences)',
        },
        labels: {
          formatter: val => Number(val).toFixed(0), // Format x-axis labels as integers
        },
      },
      yaxis: {
        title: {
          text: 'P(X = x)',
        },
        min: 0,
      },
      annotations: {
        xaxis: annotations,
      },
    };
  }

  // Calculate Poisson distribution data points
  calculatePoissonData(lambda: number): { x: number; y: number }[] {
    const poissonData = [];
    const maxRange = 20; // Display up to 20 points
    for (let x = 0; x <= maxRange; x++) {
      const probability = (Math.pow(lambda, x) * Math.exp(-lambda)) / this.factorial(x);
      if (probability < 0.0001) break; // Stop when probabilities are negligible
      poissonData.push({ x, y: parseFloat(probability.toFixed(5)) });
    }
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
