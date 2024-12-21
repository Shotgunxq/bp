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
  public showMarkers: boolean = true;

  public rangeA: number = 1; // Start of range
  public rangeB: number = 5; // End of range
  public calculatedArea: number = 0;

  constructor() {
    this.updateChiChart();
  }

  // Update chart with clean data
  updateChiChart() {
    const chiData = this.calculateChiSquared(this.degreesOfFreedom);

    // Calculate area under the curve between rangeA and rangeB
    this.calculatedArea = this.calculateAreaUnderCurve(chiData, this.rangeA, this.rangeB);

    this.chiChartOptions = {
      series: [
        {
          name: 'Chi-Squared Distribution',
          data: chiData.map(point => ({ x: parseFloat(point.x.toFixed(2)), y: parseFloat(point.y.toFixed(4)) })), // Clean x, y data
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
        title: { text: 'x' },
        tickAmount: 10, // Reduce number of ticks on x-axis
        labels: {
          rotate: 0,
          formatter: (value: string) => parseFloat(value).toFixed(1), // Round x-axis labels
        },
      },
      yaxis: {
        title: { text: 'f(x)' },
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

  // Calculate Chi-Squared distribution
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
    const step = 0.2; // Larger step to reduce clutter

    for (let x = 0; x <= maxRange; x += step) {
      chiData.push({ x, y: chiPDF(x, degreesOfFreedom) });
    }

    return chiData;
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
