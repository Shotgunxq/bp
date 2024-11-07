import { Component } from '@angular/core';
import ApexCharts from 'apexcharts'
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-materials-page',
  templateUrl: './materials-page.component.html',
  styleUrl: './materials-page.component.scss',
})
export class MaterialsPageComponent {content = "<strong>Podmienená pravdepodobnosť:</strong> Vyjadruje pravdepodobnosť udalosti $A$ za predpokladu, že nastala udalosť $B$, vypočítaná ako $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad \\text{ak } P(B) > 0$";
  content2: string = `<strong>Veta o úplnej pravdepodobnosti:</strong> Používa sa na výpočet pravdepodobnosti udalosti $B$ s využitím rozkladu na množiny $A_i, kde P(B) = \sum_{i} P(A_i) \cdot P(B \mid A_i)$`;
  content3: string = `<strong>Veta Bayesovej pravdepodobnosti:</strong> Používa sa na výpočet pravdepodobnosti udalosti $A_k$ za predpokladu, že nastala udalosť $B$, vypočítaná ako $P(A_k \\mid B) = \\frac{P(B \\mid A_k) \\cdot P(A_k)}{\\sum_{i} P(B \\mid A_i) \\cdot P(A_i)}$`;
  content4: string = `<strong>Nezávislosť náhodných udalostí:</strong> Dve udalosti $A$ a $B$ sú nezávislé, ak $P(A \\cap B) = P(A) \\cdot P(B)$, t.j., výskyt jednej nemá vplyv na výskyt druhej.`;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "My-series",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false
        }
      },
      title: {
        text: "My First Angular Chart"
      },
      xaxis: {
        categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep"]
      }
    };
  }
}

