import { Component, OnInit, inject, PLATFORM_ID, signal, effect, OnDestroy } from '@angular/core';
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
export class MapaMundiComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private currencyService = inject(CurrencyService); 

  chartOptions: any = {};
  isBrowser = signal(false);
  private timerPulso: any;
  private intensidadePulso = 20; // Controle do brilho

  constructor() {
    effect(() => {
      const moedas = this.currencyService.listaMoedas();
      if (moedas.length > 0 && this.chartOptions && this.chartOptions.series) {
        this.atualizarCoresDoMapa(moedas);
      }
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser.set(true);
      this.http.get('data/world.json').subscribe((geoJson: any) => {
        echarts.registerMap('world', geoJson);
        this.configurarMapaInicial();
        this.iniciarPulsoAutomatico(); // Inicia a pulsação
      });
    }
  }

  ngOnDestroy() {
    if (this.timerPulso) clearInterval(this.timerPulso);
  }

  // Lógica para fazer os países "respirarem" (pulsar brilho)
  private iniciarPulsoAutomatico() {
    let subindo = true;
    this.timerPulso = setInterval(() => {
      // Oscila o brilho entre 15 e 35
      if (subindo) {
        this.intensidadePulso += 2;
        if (this.intensidadePulso >= 35) subindo = false;
      } else {
        this.intensidadePulso -= 2;
        if (this.intensidadePulso <= 15) subindo = true;
      }
      
      // Força a atualização do gráfico para refletir o novo brilho
      const moedasAtuais = this.currencyService.listaMoedas();
      if (moedasAtuais.length > 0) {
        this.atualizarCoresDoMapa(moedasAtuais);
      }
    }, 150); // Velocidade do pulso (ajuste se quiser mais rápido ou devagar)
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
        type: 'map',
        map: 'world',
        layoutCenter: ['50%', '50%'],
        layoutSize: '160%',
        itemStyle: {
          areaColor: '#1a1a1a',
          borderColor: 'rgba(255,255,255,0.05)',
          shadowBlur: 10
        },
        data: []
      }]
    };
  }

  private atualizarCoresDoMapa(moedas: any[]) {
    // Adicionei os novos países que você pediu ao mapeamento
    const dadosMapa = moedas.map(m => {
      let nomeIngles = m.nome;
      if (m.sigla === 'BRL') nomeIngles = 'Brazil';
      if (m.sigla === 'USD') nomeIngles = 'United States of America';
      if (m.sigla === 'CNY') nomeIngles = 'China';
      if (m.sigla === 'JPY') nomeIngles = 'Japan';
      if (m.sigla === 'EUR') nomeIngles = 'France'; // Você pode duplicar para 'Germany'
      if (m.sigla === 'RUB') nomeIngles = 'Russia';
      if (m.sigla === 'IRR') nomeIngles = 'Iran';
      if (m.sigla === 'UAH') nomeIngles = 'Ukraine';

      const subiu = m.valor < m.anterior;
      const corBase = subiu ? '#00ff88' : '#ff4444';
      const glowCor = subiu ? 'rgba(0, 255, 136, 0.8)' : 'rgba(255, 68, 68, 0.8)';

      return {
        name: nomeIngles,
        value: subiu ? 1 : -1,
        itemStyle: {
          areaColor: corBase,
          shadowBlur: this.intensidadePulso, // USA A VARIÁVEL QUE OSCILA
          shadowColor: glowCor,
          borderColor: '#fff',
          borderWidth: 1.2
        }
      };
    });

    this.chartOptions = {
      ...this.chartOptions,
      animation: false, // Desativamos animação de entrada para o pulso ser fluido
      series: [{
        ...this.chartOptions.series[0],
        data: dadosMapa
      }]
    };
  }
}