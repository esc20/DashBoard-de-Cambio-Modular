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
  
  // 1. URLs CORRETAS (Endpoints que retornam JSON real)
  private readonly apiUrl = 'https://v6.exchangerate-api.com/v6/c1e5adfaf186943bf9b2e50f/latest/USD';
  
  // URL da API de dados do Banco Central (SGS) - Série 1178 é a SELIC
  private readonly selicUrl = 'https://bcb.gov.br';
  
  // URL da API de Medo e Ganância (Fear & Greed Index)
  private readonly sentimentUrl = 'https://alternative.me';

  // 2. O ESTADO COMPARTILHADO (O Mapa Mundi lê daqui via effect)
  listaMoedas = signal<MoedaExibicao[]>([]);

  getRates(): Observable<ExchangeRateResponse> {
    return this._httpClient.get<ExchangeRateResponse>(this.apiUrl).pipe(retry(2));
  }

  getTaxasJuros(): Observable<any> {
    return this._httpClient.get(this.selicUrl).pipe(
      retry(2),
      // Fallback para caso o CORS do Banco Central bloqueie o localhost
      catchError(() => of([{ valor: "10.75" }])) 
    );
  }

  getMarketSentiment(): Observable<any> {
    return this._httpClient.get(this.sentimentUrl).pipe(
      timeout(5000),
      catchError(err => {
        console.warn('API de sentimento falhou, usando valor neutro (50)');
        return of({ data: [{ value: "50" }] });
      })
    );
  }
}