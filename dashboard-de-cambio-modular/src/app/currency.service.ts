import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, timeout, retry, map } from 'rxjs';
import { environment } from '../environments';

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
  
  // 1. CONFIGURAÇÃO DE API (Corrigida sintaxe e endpoint)
  private readonly apiKey = environment.apiKey;
  private readonly apiUrl = `https://v6.exchangerate-api.com/v6/${this.apiKey}/latest/USD`;
  
  // 2. URLs DE DADOS REAIS (Endpoints que retornam JSON e permitem CORS)
  private readonly selicUrl = 'https://bcb.gov.br';
  private readonly sentimentUrl = 'https://alternative.me';

  listaMoedas = signal<MoedaExibicao[]>([]);
  termoBusca = signal<string>(''); 
  triggerBusca = signal<number>(0);

  getRates(): Observable<ExchangeRateResponse> {
    return this._httpClient.get<ExchangeRateResponse>(this.apiUrl).pipe(
      retry(2),
      catchError(err => {
        console.error('Erro na API de Câmbio:', err);
        throw err;
      })
    );
  }

  getTaxasJuros(): Observable<any> {
    return this._httpClient.get<any[]>(this.selicUrl).pipe(
      // Pega o último valor disponível na lista (o mais atual)
      map(dados => Array.isArray(dados) ? dados[dados.length - 1] : { valor: "10.75" }),
      retry(1),
      catchError(() => of({ valor: "10.75" })) 
    );
  }

  getMarketSentiment(): Observable<any> {
    return this._httpClient.get(this.sentimentUrl).pipe(
      timeout(5000),
      catchError(() => of({ data: [{ value: "50", value_classification: "Neutral" }] }))
    );
  }

  getUltimasNoticias(): Observable<any[]> {
    return of(this.getNoticiasBackup());
  }

  private getNoticiasBackup() {
    return [
      { 
        title: 'Tensões Geopolíticas: Impacto imediato no fluxo de Dólar e Ouro.',
        urlToImage: 'conflito-no-mundo.jpg',
        source: { name: 'Reuters' },
        url: 'https://reuters.com'
      },
      { 
        title: 'Bancos Centrais discutem novas taxas para conter inflação global.',
        urlToImage: 'inflacao.webp',
        source: { name: 'Bloomberg' },
        url: 'https://bloomberg.com'
      },
      { 
        title: 'Bitcoin e Criptoativos: Alta volatilidade após novas regulações.',
        urlToImage: 'traxer-kM6QNrgo0YE-unsplash.webp',
        source: { name: 'CNBC' },
        url: 'https://cnbc.com'
      }
    ];
  }
}
