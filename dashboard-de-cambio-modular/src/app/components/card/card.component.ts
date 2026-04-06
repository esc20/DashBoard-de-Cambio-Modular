import { Component, OnInit, signal, inject, Injectable, ChangeDetectionStrategy, PLATFORM_ID, Signal } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, retry, timer, switchMap, Subscription } from 'rxjs';

export interface ExchangeRateResponse {
  result: string;
  base_code: string;
  conversion_rates: { [key: string]: number };
  time_last_update_utc: string;
}

interface MoedaExibicao {
  nome: string;
  sigla: string;
  valor: number;
  anterior: number;
}

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly _httpClient = inject(HttpClient);
  private readonly apiUrl = 'https://v6.exchangerate-api.com/v6/c1e5adfaf186943bf9b2e50f/latest/USD';

  getRates(): Observable<ExchangeRateResponse> {
    return this._httpClient.get<ExchangeRateResponse>(this.apiUrl).pipe(retry({ count: 3, delay: 2000 }));
  }
}

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

  // 1. SIGNALS (Sempre no topo da classe para organização)
  listaMoedas = signal<MoedaExibicao[]>([]);
  ultimaAtualizacao = signal<string>('---');
  exibirExplicacao = signal(false); // Correção: signal() com "s" minúsculo

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

  // 2. MÉTODOS DE AÇÃO
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
    timer(0, 60000).pipe(
      switchMap(() => this._currencyService.getRates())
    ).subscribe({
      next: (res) => {
        const taxas = res.conversion_rates;
        
        // 1. Recupera o cache
        const cacheSalvo = localStorage.getItem('ultimas_taxas');
        const taxasAnteriores = cacheSalvo ? JSON.parse(cacheSalvo) : taxas; 

        this.listaMoedas.set(this.moedasConfig.map(cfg => {
          const valorReal = taxas[cfg.sigla] || 0;

          const valorSimulado = valorReal + (Math.random() * 0.0002 - 0.0001);

          const valorAnteriorNoCache = taxasAnteriores[cfg.sigla] || valorReal;

          return {
            ...cfg,
            valor: valorSimulado,
            anterior: valorAnteriorNoCache // Agora a variável existe!
          };
        }));

        // 3. Atualiza o cache para a próxima rodada
        localStorage.setItem('ultimas_taxas', JSON.stringify(taxas));
        this.ultimaAtualizacao.set(new Date().toLocaleTimeString());
      },
      error: (err) => console.error('Erro na API:', err)
    });
   }
  }