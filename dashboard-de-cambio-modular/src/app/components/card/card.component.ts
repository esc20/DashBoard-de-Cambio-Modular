import { Component, OnInit, signal, inject, Injectable, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
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
  styleUrl: './card.Component.scss',
  template: `
    <div class="card-financeiro">
      <div class="flex justify-between items-center mb-6">
        <h2 class="card-title">Câmbio Real-Time</h2>
        <div class="ponto-luz positivo animate-pulse"></div>
      </div>

      <div class="space-y-2">
        @for (moeda of listaMoedas(); track moeda.sigla) {
          <div class="linha-moeda">
            <div class="flag-container">
              <img [src]="'https://flagcdn.com/w80/' + getFlagCode(moeda.sigla) + '.png'" [alt]="moeda.sigla"
                   (error)="$any($event.target).src = 'https://flagcdn.com/w80/un.png'">
            </div>
            <div class="info-pais">
              <span class="nome">{{ moeda.nome }}</span>
              <span class="sigla">{{ moeda.sigla }}</span>
            </div>
            <div class="valor">
              {{ formatarValor(moeda.valor) }}
            </div>
            <div class="ponto-luz" [class.positivo]="moeda.valor < moeda.anterior" [class.negativo]="moeda.valor > moeda.anterior"></div>
          </div>
        }
      </div>
      <div class="status-text" style="font-size: 0.7rem; opacity: 0.6; margin-top: 10px;">
        Sincronizado: {{ ultimaAtualizacao() }}
      </div>
    </div>
  `
})
export class CardComponent implements OnInit {
  private readonly _currencyService = inject(CurrencyService);
  private readonly _decimalPipe = inject(DecimalPipe);
  private readonly platformId = inject(PLATFORM_ID); // Identifica se é servidor ou navegador

  listaMoedas = signal<MoedaExibicao[]>([]);
  ultimaAtualizacao = signal<string>('---');

  private moedasConfig = [
    { sigla: 'BRL', nome: 'Brasil' },
    { sigla: 'EUR', nome: 'União Europeia' },
    { sigla: 'GBP', nome: 'Reino Unido' },
    { sigla: 'JPY', nome: 'Japão' },
    { sigla: 'CNY', nome: 'China' }
  ];

  ngOnInit() {
    // SÓ inicia o timer se estiver no NAVEGADOR. 
    // No Servidor (SSR), isso evita o erro de Timeout.
    if (isPlatformBrowser(this.platformId)) {
      this.iniciarMonitoramento();
    }
  }

  private iniciarMonitoramento() {
    timer(0, 60000).pipe(
      switchMap(() => this._currencyService.getRates())
    ).subscribe({
      next: (res) => {
        const taxas = res.conversion_rates;
        this.listaMoedas.update(atual => this.moedasConfig.map(cfg => {
          const valorNovo = taxas[cfg.sigla] || 0;
          const moedaAnterior = atual.find(m => m.sigla === cfg.sigla);
          return {
            ...cfg,
            valor: valorNovo,
            anterior: moedaAnterior ? moedaAnterior.valor : valorNovo
          };
        }));
        this.ultimaAtualizacao.set(new Date().toLocaleTimeString());
      },
      error: (err) => console.error('Erro na API:', err)
    });
  }

  getFlagCode(sigla: string): string {
    const map: any = { 'BRL': 'br', 'EUR': 'eu', 'GBP': 'gb', 'JPY': 'jp', 'CNY': 'cn' };
    return map[sigla] || 'un';
  }

  formatarValor(v: number) { return this._decimalPipe.transform(v, '1.2-4'); }
}