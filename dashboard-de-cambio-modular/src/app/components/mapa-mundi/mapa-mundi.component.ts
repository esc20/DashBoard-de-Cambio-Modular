import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgxEchartsDirective} from 'ngx-echarts';
import * as echarts from 'echarts';

@Component({
  selector: 'app-mapa-mundi',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './mapa-mundi.component.html',
  styleUrl: './mapa-mundi.component.scss'
})
export class MapaMundiComponent implements OnInit {
  private http = inject(HttpClient);
  chartOptions: any = {};

  ngOnInit() {
    // Busca o arquivo de coordenadas que você salvou em assets
    this.http.get('assets/data/world.json').subscribe((geoJson: any) => {
      echarts.registerMap('world', geoJson);
      this.configurarMapa();
    });
  }

  configurarMapa() {
    this.chartOptions = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}' // Mostra o nome do país ao passar o mouse
      },
      visualMap: {
        show: false,
        min: -1,
        max: 1,
        inRange: {
          color: ['#ff4444', '#555', '#00ff88'] // Vermelho, Cinza, Verde
        }
      },
      series: [
        {
          type: 'map',
          map: 'world',
          emphasis: {
            itemStyle: { areaColor: '#ffff00' } // Amarelo no hover
          },
          data: [
            { name: 'Brazil', value: 1 },
            { name: 'United States', value: -1 }
          ]
        }
      ]
    };
  }
}