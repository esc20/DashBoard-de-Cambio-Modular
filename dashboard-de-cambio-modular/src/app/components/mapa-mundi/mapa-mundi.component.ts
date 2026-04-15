import { Component, OnInit, inject, PLATFORM_ID, signal, effect } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgxEchartsDirective } from 'ngx-echarts';
import * as echarts from 'echarts';
import { CurrencyService } from '../../currency.service'; 

@Component({
  selector: 'app-mapa-mundi',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './mapa-mundi.component.html',
  styleUrl: './mapa-mundi.component.scss'
})
export class MapaMundiComponent implements OnInit {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private currencyService = inject(CurrencyService); 

  chartOptions: any = {};
  isBrowser = signal(false);
  private echartsInstance: any; 

  constructor() {
    effect(() => {
      const moedas = this.currencyService.listaMoedas();
      if (moedas.length > 0 && this.echartsInstance) {
        this.atualizarCoresDoMapa(moedas);
      }
    });
  }

  onChartInit(ec: any) {
    this.echartsInstance = ec;
    const moedasAtuais = this.currencyService.listaMoedas();
    if (moedasAtuais.length > 0) {
      this.atualizarCoresDoMapa(moedasAtuais);
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser.set(true);
      this.http.get('data/world.json').subscribe((geoJson: any) => {
        echarts.registerMap('world', geoJson);
        this.configurarMapaInicial();
      });
    }
  }

  ajustarZoom(fator: number) {
    if (this.echartsInstance) {
      const options = this.echartsInstance.getOption();
      const currentZoom = (options as any).series[0].zoom || 1;
      this.echartsInstance.setOption({
        series: [{ zoom: Math.min(Math.max(currentZoom * fator, 1), 5) }]
      });
    }
  }

  resetarMapa() {
    if (this.echartsInstance) {
      this.echartsInstance.setOption({ series: [{ zoom: 1, center: undefined }] });
    }
  }

  configurarMapaInicial() {
    this.chartOptions = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}',
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        textStyle: { color: '#fff' }
      },
      series: [{
        name: 'world',
        type: 'map',
        map: 'world',
        layoutCenter: ['50%', '50%'],
        layoutSize: '160%',
        roam: true, 
        scaleLimit: { min: 1, max: 5 },
        itemStyle: {
          areaColor: 'rgba(255, 255, 255, 0.05)', 
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 0.5
        },
        data: [] 
      }]
    };
  }

  // Função auxiliar para aplicar o estilo Neon
  private estilizarPais(nome: string, subiu: boolean) {
    const corNeon = subiu ? '#00ff88' : '#ff4444';
    const brilhoNeon = subiu ? 'rgba(0, 255, 136, 0.7)' : 'rgba(255, 68, 68, 0.7)';

    return {
      name: nome,
      itemStyle: {
        areaColor: corNeon,
        borderColor: '#fff',
        borderWidth: 1.5,
        shadowBlur: 25, 
        shadowColor: brilhoNeon,
        opacity: 1 
      }
    };
  }

  private gerarDadosMapa(moedas: any[]) {
    // 1. Dados que vem da API de Câmbio
    const dadosApi = moedas.map(m => {
      let nomeJSON = '';
      if (m.sigla === 'BRL') nomeJSON = 'Brazil';
      if (m.sigla === 'USD') nomeJSON = 'United States of America';
      if (m.sigla === 'CNY') nomeJSON = 'China';
      if (m.sigla === 'JPY') nomeJSON = 'Japan';
      if (m.sigla === 'EUR') nomeJSON = 'France'; 
      if (m.sigla === 'GBP') nomeJSON = 'United Kingdom';

      const subiu = m.valor < m.anterior;
      return nomeJSON ? this.estilizarPais(nomeJSON, subiu) : null;
    }).filter(d => d !== null);

    // 2. Dados Manuais para Países de Conflito (Caso não estejam na API)
    // Aqui você define se quer que eles apareçam em vermelho (false) ou verde (true)
    const dadosConflito = [
      this.estilizarPais('Russia', false),
      this.estilizarPais('Iran', false),
      this.estilizarPais('Israel', true),
      this.estilizarPais('Ukraine', true)
    ];

    // Une os dois arrays
    return [...dadosApi, ...dadosConflito];
  }

  private atualizarCoresDoMapa(moedas: any[]) {
    if (!this.echartsInstance) return;
    this.echartsInstance.setOption({
      series: [{
        data: this.gerarDadosMapa(moedas)
      }]
    });
  }
}