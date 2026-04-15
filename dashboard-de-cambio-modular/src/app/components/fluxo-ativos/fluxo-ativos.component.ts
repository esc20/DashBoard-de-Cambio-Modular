import { Component, OnInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts'; 
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-fluxo-ativos',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './fluxo-ativos.component.html',
  styleUrl: './fluxo-ativos.component.scss'
})
export class FluxoAtivosComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  
  chartOptions = signal<EChartsOption | null>(null);
  isBrowser = signal(false); // Controla a exibição no HTML

  ngOnInit() {
    // Só inicializa se for o navegador (cliente)
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser.set(true);
      this.configurarGrafico();
    }
  }

  configurarGrafico() {
    const dados = [
      { name: 'S&P 500', value: 12.5 },
      { name: 'Ouro', value: 8.2 },
      { name: 'Petróleo', value: -5.4 },
      { name: 'Bitcoin', value: 15.8 },
      { name: 'Treasuries', value: -3.1 },
      { name: 'Dólar (DXY)', value: 4.2 }
    ];

    this.chartOptions.set({
      backgroundColor: 'transparent',
      grid: { left: '3%', right: '15%', bottom: '3%', top: '5%', containLabel: true },
      xAxis: { type: 'value', splitLine: { show: false }, axisLabel: { show: false } },
      yAxis: {
        type: 'category',
        data: dados.map(d => d.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#fff', fontSize: 11, fontWeight: 'bold' }
      },
      series: [{
        type: 'bar',
        data: dados.map(d => ({
          value: d.value,
          itemStyle: {
            color: d.value > 0 ? '#00ff88' : '#ff4444',
            borderRadius: 5,
            shadowBlur: 10,
            shadowColor: d.value > 0 ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255, 68, 68, 0.4)'
          }
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right',
          formatter: '{c}B',
          color: '#fff',
          fontSize: 10
        }
      }]
    });
  }
}