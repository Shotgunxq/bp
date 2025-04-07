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
  public degreesOfFreedom: number = 10;
  public rangeA: number = -2;
  public rangeB: number = 2;
  public calculatedArea: number = 0;
  public showMarkers: boolean = true;

  constructor() {
    this.updateTChart();
  }

  updateTChart() {
    const tData = this.calculateTDistribution(this.degreesOfFreedom);

    // Calculate the area under the curve between rangeA and rangeB
    this.calculatedArea = this.calculateAreaUnderCurve(tData, this.rangeA, this.rangeB);

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

    // Full t‑distribution series (line)
    const mainSeries = {
      name: 't-Distribution',
      type: 'line',
      data: tData.map(point => ({ x: point.x, y: point.y })),
    };

    // Highlighted area series (only include data points between rangeA and rangeB)
    const highlightedData = tData.filter(point => point.x >= this.rangeA && point.x <= this.rangeB);
    const highlightSeries = {
      name: 'Highlighted Area',
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

    // Update the chart options with two series and the annotations
    this.tChartOptions = {
      series: [mainSeries, highlightSeries],
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
        title: { text: 't' },
        min: -4,
        max: 4,
        tickAmount: 9,
        labels: {
          formatter: val => parseFloat(val).toFixed(1),
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
      const x = parseFloat(t.toFixed(1));
      const y = parseFloat(tPDF(t, degreesOfFreedom).toFixed(4));
      tData.push({ x, y });
    }

    return tData;
  }

  calculateAreaUnderCurve(data: { x: number; y: number }[], a: number, b: number): number {
    let area = 0;
    const filteredData = data.filter(point => point.x >= a && point.x <= b);

    for (let i = 0; i < filteredData.length - 1; i++) {
      const x1 = filteredData[i].x;
      const y1 = filteredData[i].y;
      const x2 = filteredData[i + 1].x;
      const y2 = filteredData[i + 1].y;

      area += ((y1 + y2) / 2) * (x2 - x1);
    }

    return parseFloat(area.toFixed(5));
  }
}
