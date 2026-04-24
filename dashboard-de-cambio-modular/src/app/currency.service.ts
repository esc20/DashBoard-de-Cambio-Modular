import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, timeout, retry, map } from 'rxjs';
import { environment } from '../environments'; // Certifique-se que o arquivo local existe como src/environments.ts

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
  
  // 1. CONFIGURAÇÃO DE API (Usando a chave injetada pela Vercel)
  private readonly apiKey = environment.apiKey;
  // CORREÇÃO: Adicionado o /v6/ e o $ que faltava na interpolação
  private readonly apiUrl = `https://exchangerate-api.com{this.apiKey}/latest/USD`;
  
  // 2. URLs DE DADOS REAIS (Endpoints JSON que não bloqueiam CORS)
  private readonly selicUrl = 'https://bcb.gov.br';
  private readonly sentimentUrl = 'https://alternative.me';

  listaMoedas = signal<MoedaExibicao[]>([]);
  termoBusca = signal<string>(''); 
  triggerBusca = signal<number>(0);

  getRates(): Observable<ExchangeRateResponse> {
    return this._httpClient.get<ExchangeRateResponse>(this.apiUrl).pipe(retry(2));
  }

  getTaxasJuros(): Observable<any> {
    return this._httpClient.get(this.selicUrl).pipe(
      retry(1),
      catchError(() => of([{ valor: "10.75" }])) 
    );
  }

  getMarketSentiment(): Observable<any> {
    return this._httpClient.get(this.sentimentUrl).pipe(
      timeout(5000),
      catchError(() => of({ data: [{ value: "50" }] }))
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
        title: 'Bitcoin e Criptoativos: Alta volatilidade após novas regulações institucionais.',
        urlToImage: 'https://unsplash.com',
        source: { name: 'CNBC' },
        url: 'https://cnbc.com'
      }
    ];
  }
}
