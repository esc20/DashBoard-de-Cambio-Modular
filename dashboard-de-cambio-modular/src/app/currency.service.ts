import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, timeout, retry } from 'rxjs';

// Interface para as moedas que o mapa e o card compartilham
export interface MoedaExibicao {
  nome: string;
  sigla: string;
  valor: number;
  anterior: number;
}

export interface ExchangeRateResponse {
  result: string;
  base_code: string;
  conversion_rates: { [key: string]: number }; 
  time_last_update_utc: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly _httpClient = inject(HttpClient);
  
  // 1. URLs CORRETAS (Endpoints de dados JSON)
  private readonly apiUrl = 'https://v6.exchangerate-api.com/v6/c1e5adfaf186943bf9b2e50f/latest/USD';
  private readonly selicUrl = 'https://bcb.gov.br';
  private readonly sentimentUrl = 'https://alternative.me';

  // 2. O ESTADO COMPARTILHADO (O Mapa Mundi vai ler daqui!)
  listaMoedas = signal<MoedaExibicao[]>([]);

  getRates(): Observable<ExchangeRateResponse> {
    return this._httpClient.get<ExchangeRateResponse>(this.apiUrl).pipe(retry(2));
  }

  getTaxasJuros(): Observable<any> {
    return this._httpClient.get(this.selicUrl).pipe(retry(2));
  }

  getMarketSentiment(): Observable<any> {
    return this._httpClient.get(this.sentimentUrl).pipe(
      timeout(5000),
      catchError(err => {
        console.error('API de sentimento falhou, usando neutro');
        return of({ data: [{ value: "50" }] });
      })
    );
  }
}