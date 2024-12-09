import { Component } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexAnnotations,
  ApexMarkers,
  ApexDataLabels,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  annotations?: ApexAnnotations;
  dataLabels: ApexDataLabels; // Add this line
  // regions?: ApexAnnotations;
};
@Component({
  selector: 'graph-density',
  templateUrl: './density.component.html',
  styleUrl: './density.component.scss',
})
export class DensityComponent {
  public chartOptions!: Partial<ChartOptions>;
  public densityChartOptions!: Partial<ChartOptions>;
  public showHighlight = true; // Default state for highlight
  public showDataLabels = true; // Toggle for data labels (values)

  public mean = 0;
  public stdDev = 1;
  public n = 10;
  public p = 0.5;
  highlightX = -4;

  constructor() {
    this.updateDensityChart();
  }
  toggleHighlight() {
    this.updateDensityChart(); // Rebuild the chart with or without highlight
  }

  // Update the density chart for normal distribution
  toggleDataLabels() {
    this.densityChartOptions.dataLabels = {
      enabled: this.showDataLabels,
    };
  }

  updateDensityChart() {
    const densityData = [];
    const normalDensity = (x: number, mean: number, stdDev: number): number => {
      return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    };

    const threshold = 0.0001;
    const step = 0.1;

    let x = this.mean;
    while (true) {
      const density = normalDensity(x, this.mean, this.stdDev);
      if (density < threshold) break;
      densityData.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(density.toFixed(4)) });
      x += step;
    }

    x = this.mean - step;
    while (true) {
      const density = normalDensity(x, this.mean, this.stdDev);
      if (density < threshold) break;
      densityData.unshift({ x: parseFloat(x.toFixed(2)), y: parseFloat(density.toFixed(4)) });
      x -= step;
    }

    const roundedHighlightX = parseFloat(this.highlightX.toFixed(1));

    this.densityChartOptions = {
      series: [
        {
          name: 'f_X(x)',
          data: densityData,
        },
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: this.showDataLabels, // Control data label visibility
        style: {
          fontSize: '12px',
          colors: ['#304758'],
        },
        formatter: (val: number) => val.toFixed(2), // Format data labels
      },

      xaxis: {
        type: 'numeric',
        title: {
          text: 'x',
        },
      },
      yaxis: {
        title: {
          text: 'f_X(x)',
        },
        min: 0,
      },
      annotations: {
        xaxis: this.showHighlight
          ? [
              {
                x: roundedHighlightX,
                borderColor: '#FF4560',
                strokeDashArray: 10,
                label: {
                  text: `P(x <= ${roundedHighlightX})`,
                  style: {
                    background: '#FF4560',
                    color: '#fff',
                  },
                },
              },
              {
                x: densityData[0].x,
                x2: roundedHighlightX,
                fillColor: 'rgba(255, 69, 96, 0.2)',
              },
            ]
          : [],
      },
    };
  }
}
