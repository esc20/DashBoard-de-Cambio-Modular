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
  exibirExplicacao = signal(false);
  private echartsInstance: any; 

  constructor() {
    effect(() => {
      const moedas = this.currencyService.listaMoedas();
      if (moedas.length > 0 && this.echartsInstance) {
        this.atualizarCoresDoMapa(moedas);
      }

      const busca = this.currencyService.termoBusca();
      const trigger = this.currencyService.triggerBusca(); 
      
      if (trigger > 0 && this.echartsInstance) {
        const paisEncontrado = this.focarNoPais(busca);
        
        if (paisEncontrado) {
          const elementoMapa = document.querySelector('.map-row');
          elementoMapa?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          elementoMapa?.classList.add('highlight-search');
          setTimeout(() => elementoMapa?.classList.remove('highlight-search'), 2000);
        }
      }
    });
  }

  toggleExplicacao() {
    this.exibirExplicacao.update(v => !v);
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

  private focarNoPais(nomeOriginal: string): boolean {
    const dicionario: { [key: string]: string } = {
      'brasil': 'Brazil',
      'brazil': 'Brazil',
      'eua': 'United States of America',
      'usa': 'United States of America',
      'estados unidos': 'United States of America',
      'china': 'China',
      'japão': 'Japan',
      'japao': 'Japan',
      'frança': 'France',
      'alemanha': 'Germany',
      'reino unido': 'United Kingdom',
      'rússia': 'Russia',
      'israel': 'Israel',
      'ucrânia': 'Ukraine',
      'irã': 'Iran'
    };

    const nomeBusca = nomeOriginal.toLowerCase().trim();
    const nomeTraduzido = dicionario[nomeBusca] || nomeOriginal;

    // Obtemos a lista de países que o mapa conhece para validar
    const geoData = echarts.getMap('world');
    if (!geoData) return false;

    const existeNoMapa = geoData.geoJSON.features.some(
      (f: any) => f.properties.name.toLowerCase() === nomeTraduzido.toLowerCase()
    );

    if (existeNoMapa) {
      // 1. Limpa seleções anteriores
      this.echartsInstance.dispatchAction({ type: 'geoUnSelect' });

      // 2. Dispara a ação de seleção para o país alvo
      this.echartsInstance.dispatchAction({
        type: 'geoSelect',
        name: nomeTraduzido
      });

      // 3. Atualiza o mapa forçando center: undefined e zoom
      // center: undefined permite que o ECharts foque no item 'selected: true'
      this.echartsInstance.setOption({
        series: [{
          name: 'world',
          zoom: 4,
          center: undefined, 
          data: [
            ...this.gerarDadosMapa(this.currencyService.listaMoedas()),
            { name: nomeTraduzido, selected: true }
          ]
        }]
      });
      return true;
    }
    return false;
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
      this.echartsInstance.setOption({ 
        series: [{ 
          zoom: 1, 
          center: undefined,
          data: this.gerarDadosMapa(this.currencyService.listaMoedas())
        }] 
      });
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
        scaleLimit: { min: 1, max: 8 },
        itemStyle: {
          areaColor: 'rgba(255, 255, 255, 0.05)', 
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 0.5
        },
        data: [] 
      }]
    };
  }

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

    const dadosConflito = [
      this.estilizarPais('Russia', false),
      this.estilizarPais('Iran', false),
      this.estilizarPais('Israel', true),
      this.estilizarPais('Ukraine', true)
    ];

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
