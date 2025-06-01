import { Component } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexAnnotations } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  annotations?: ApexAnnotations;
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
  public calculatedArea: number = 0; // Calculated area under the curve

  constructor() {
    this.updatePoissonChart();
  }

  updatePoissonChart() {
    const poissonData = this.calculatePoissonData(this.lambda);

    // Calculate the area between rangeA and rangeB
    this.calculatedArea = this.calculateAreaUnderCurve(poissonData, this.rangeA, this.rangeB);

    // Define annotations for the vertical lines only (remove the rectangle annotation)
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

    // Full Poisson distribution series as a line chart
    const mainSeries = {
      name: 'P(X = x)',
      type: 'line',
      data: poissonData.map(point => ({ x: point.x, y: point.y })),
    };

    // Highlighted area series for data between rangeA and rangeB
    const highlightedData = poissonData.filter(point => point.x >= this.rangeA && point.x <= this.rangeB);
    const highlightSeries = {
      name: 'Zvýraznená plocha',
      type: 'area',
      data: highlightedData.map(point => ({ x: point.x, y: point.y })),
      fill: {
        type: 'solid',
        opacity: 0.25,
      },
      stroke: {
        width: 0,
      },
    };

    // Update chart options with both series and the annotations
    this.poissonChartOptions = {
      series: [mainSeries, highlightSeries],
      chart: {
        height: 350,
        type: 'line',
        toolbar: { show: false },
      },
      xaxis: {
        type: 'numeric',
        title: { text: 'x (Výskyty)' },
        tickAmount: 20,
        labels: {
          formatter: val => parseFloat(val).toFixed(0),
        },
      },
      yaxis: {
        title: { text: 'P(X = x)' },
        min: 0,
        labels: {
          formatter: value => value.toFixed(3),
        },
      },
      annotations: {
        xaxis: annotations,
      },
    };
  }

  calculatePoissonData(lambda: number): { x: number; y: number }[] {
    const poissonData = [];
    const maxRange = 40;
    const step = 1;

    for (let x = 0; x <= maxRange; x += step) {
      const probability = (Math.pow(lambda, x) * Math.exp(-lambda)) / this.factorial(x);
      if (probability < 0.001) break;
      poissonData.push({ x, y: parseFloat(probability.toFixed(5)) });
    }

    return poissonData;
  }

  factorial(n: number): number {
    return n <= 1 ? 1 : n * this.factorial(n - 1);
  }

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
