import { Component } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexTitleSubtitle, ApexAnnotations, ApexMarkers, ApexDataLabels } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  annotations?: ApexAnnotations;
  dataLabels: ApexDataLabels;
  markers?: ApexMarkers; // Include markers property
};

@Component({
  selector: 'graph-poisson',
  templateUrl: './poisson.component.html',
  styleUrls: ['./poisson.component.scss'],
})
export class PoissonComponent {
  public poissonChartOptions!: Partial<ChartOptions>;
  public lambda: number = 3; // Default λ
  public highlightX: number = 2; // Default highlight
  public showHighlight: boolean = true; // Toggle for highlighting
  public showMarkers: boolean = true; // Toggle for markers visibility

  constructor() {
    this.updatePoissonChart();
  }

  updatePoissonChart() {
    const poissonData = this.calculatePoissonData(this.lambda);

    const annotations = this.showHighlight
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
      : [];

    this.poissonChartOptions = {
      series: [
        {
          name: 'P(X = x)',
          data: poissonData.map(point => point.y),
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
        categories: poissonData.map(point => point.x.toString()),
        title: {
          text: 'x (Occurrences)',
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
      // dataLabels: {
      //   enabled: true,
      //   formatter: (val: number) => val.toFixed(5), // Format values to 5 decimals
      //   style: {
      //     fontSize: '12px',
      //   },
      // },
    };
  }

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

  factorial(n: number): number {
    return n <= 1 ? 1 : n * this.factorial(n - 1);
  }
}
