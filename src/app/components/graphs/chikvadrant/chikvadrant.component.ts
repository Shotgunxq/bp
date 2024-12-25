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
  selector: 'graph-chikvadrant',
  templateUrl: './chikvadrant.component.html',
  styleUrls: ['./chikvadrant.component.scss'],
})
export class ChikvadrantComponent {
  public chiChartOptions!: Partial<ChartOptions>;
  public degreesOfFreedom: number = 4; // Default degrees of freedom
  public rangeA: number = 1; // Start of range
  public rangeB: number = 5; // End of range
  public calculatedArea: number = 0; // Calculated area under the curve
  public showMarkers: boolean = true; // Toggle for markers visibility

  constructor() {
    this.updateChiChart();
  }

  updateChiChart() {
    const chiData = this.calculateChiSquared(this.degreesOfFreedom);

    // Calculate area under the curve
    this.calculatedArea = this.calculateAreaUnderCurve(chiData, this.rangeA, this.rangeB);

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
      {
        x: this.rangeA,
        x2: this.rangeB,
        fillColor: 'rgba(0, 123, 255, 0.2)', // Highlight area under the curve
        opacity: 0.5,
      },
    ];

    this.chiChartOptions = {
      series: [
        {
          name: 'Chi-Squared Distribution',
          data: chiData.map(point => ({ x: point.x, y: point.y })),
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        toolbar: { show: false },
      },
      markers: {
        size: this.showMarkers ? 5 : 0,
        shape: 'circle',
      },
      xaxis: {
        type: 'numeric',
        title: { text: 'x' },
        tickAmount: 20,
        labels: {
          formatter: val => parseFloat(val).toFixed(1),
        },
      },
      yaxis: {
        title: { text: 'f(x)' },
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
    const maxRange = 20;
    const step = 0.1;

    for (let x = 0; x <= maxRange; x += step) {
      chiData.push({ x: parseFloat(x.toFixed(1)), y: parseFloat(chiPDF(x, degreesOfFreedom).toFixed(4)) });
    }

    return chiData;
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
