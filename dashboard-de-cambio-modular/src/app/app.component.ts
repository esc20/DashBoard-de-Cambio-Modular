import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * Interface para a resposta da API de Taxas de Câmbio
 */
interface ExchangeRateResponse {
  result: string;
  base_code: string;
  conversion_rates: { [key: string]: number };
  time_last_update_utc: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  // IMPORTANTE: Referenciando seus arquivos externos aqui
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  // Estados reativos (Signals) para o seu HTML consumir
  rates = signal<{ [key: string]: number }>({});
  baseCurrency = signal<string>('USD');
  targetCurrency = signal<string>('BRL');
  amount = signal<number>(1);
  convertedValue = signal<number>(0);
  
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Coloque sua chave de API aqui ou em um environment
  private readonly API_KEY = 'SUA_CHAVE_AQUI';

  ngOnInit(): void {
    this.loadRates();
  }

  /**
   * Busca as taxas na API e atualiza o estado
   */
  loadRates(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const url = `https://v6.exchangerate-api.com/v6/${this.API_KEY}/latest/${this.baseCurrency()}`;

    this.http.get<ExchangeRateResponse>(url)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          this.errorMessage.set('Falha ao conectar com o serviço de câmbio.');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((data) => {
        if (data && data.result === 'success') {
          this.rates.set(data.conversion_rates);
          this.calculateConversion();
        }
      });
  }

  /**
   * Lógica de cálculo baseada nas taxas carregadas
   */
  calculateConversion(): void {
    const rate = this.rates()[this.targetCurrency()];
    if (rate) {
      this.convertedValue.set(this.amount() * rate);
    }
  }

  // Métodos que seu HTML (card.component.html) pode chamar via (change) ou (input)
  onAmountChange(value: number): void {
    this.amount.set(value);
    this.calculateConversion();
  }

  onCurrencyChange(newBase: string): void {
    this.baseCurrency.set(newBase);
    this.loadRates();
  }
}