import { Component, OnInit, signal, inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { timer, switchMap, retry, catchError, of } from 'rxjs';
import { CurrencyService, MoedaExibicao } from '../../currency.service'; 

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './card.component.scss',
  templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {
  private readonly _currencyService = inject(CurrencyService);
  private readonly _decimalPipe = inject(DecimalPipe);
  private readonly platformId = inject(PLATFORM_ID);

  listaMoedas = signal<MoedaExibicao[]>([]);
  ultimaAtualizacao = signal<string>('---');
  exibirExplicacao = signal(false);

  private moedasConfig = [
    { sigla: 'BRL', nome: 'Brasil' },
    { sigla: 'USD', nome: 'Estados Unidos'},
    { sigla: 'EUR', nome: 'União Europeia' },
    { sigla: 'GBP', nome: 'Reino Unido' },
    { sigla: 'JPY', nome: 'Japão' },
    { sigla: 'CNY', nome: 'China' }
  ];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.iniciarMonitoramento();
    }
  }

  toggleExplicacao() {
    this.exibirExplicacao.update(valor => !valor);
  }

  getFlagCode(sigla: string): string {
    const map: any = { 'BRL': 'br', 'USD': 'us', 'EUR': 'eu', 'GBP': 'gb', 'JPY': 'jp', 'CNY': 'cn' };
    return map[sigla] || 'un';
  }

  formatarValor(v: number) { 
    return this._decimalPipe.transform(v, '1.2-4'); 
  }

  private iniciarMonitoramento() {
    // Intervalo de 1 hora para economizar API, mudando para 1 min se estiver em simulação
    timer(0, 3600000).pipe(
      switchMap(() => this._currencyService.getRates().pipe(
        catchError(err => {
          console.warn('API Bloqueada (429) ou Offline. Ativando Simulação Inteligente.');
          // Retorna um objeto fake para cair no processarDados
          return of({
            conversion_rates: { 'BRL': 5.42, 'USD': 1.0, 'EUR': 0.92, 'GBP': 0.78, 'JPY': 156.0, 'CNY': 7.23 },
            isSimulado: true
          });
        })
      )),
      retry({ count: 2, delay: 5000 })
    ).subscribe({
      next: (res: any) => {
        this.processarDados(res.conversion_rates, res.isSimulado);
      }
    });
  }

  private processarDados(taxas: any, isSimulado: boolean = false) {
    const cacheSalvo = localStorage.getItem('ultimas_taxas');
    const taxasAnteriores = cacheSalvo ? JSON.parse(cacheSalvo) : taxas; 

    const novasMoedas: MoedaExibicao[] = this.moedasConfig.map(cfg => {
      const valorBase = taxas[cfg.sigla] || 1;
      
      // Se for simulado, adicionamos uma micro-oscilação aleatória para o mapa "viver"
      const variacao = isSimulado ? (Math.random() * 0.002 - 0.001) : 0;
      const valorFinal = valorBase + (valorBase * variacao);

      return {
        ...cfg,
        valor: valorFinal,
        anterior: taxasAnteriores[cfg.sigla] || valorBase
      };
    });

    // 1. Atualiza o Card
    this.listaMoedas.set(novasMoedas);
    
    // 2. ACENDE O MAPA E O RELATÓRIO (Envia para o serviço global)
    this._currencyService.listaMoedas.set(novasMoedas);

    // 3. Gerencia o Cache e o Texto de rodapé
    if (!isSimulado) {
      localStorage.setItem('ultimas_taxas', JSON.stringify(taxas));
      this.ultimaAtualizacao.set(new Date().toLocaleTimeString());
    } else {
      this.ultimaAtualizacao.set(new Date().toLocaleTimeString() + ' (Simulação)');
    }
  }
}




