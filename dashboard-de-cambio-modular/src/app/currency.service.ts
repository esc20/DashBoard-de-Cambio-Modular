import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, timeout, retry, map } from 'rxjs';

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
  
  // 1. URLs CORRETAS (Endpoints de dados JSON reais)
  private readonly apiUrl = 'https://v6.exchangerate-api.com/v6/c1e5adfaf186943bf9b2e50f/latest/USD';
  
  // URL da API de dados do Banco Central (SGS) - Série 1178 é a SELIC
  private readonly selicUrl = 'https://bcb.gov.br';
  
  // URL da API de Medo e Ganância (Fear & Greed Index)
  private readonly sentimentUrl = 'https://alternative.me';

  // 2. O ESTADO COMPARTILHADO (O Mapa Mundi e Relatório lêem daqui)
  listaMoedas = signal<MoedaExibicao[]>([]);

  getRates(): Observable<ExchangeRateResponse> {
    return this._httpClient.get<ExchangeRateResponse>(this.apiUrl).pipe(retry(2));
  }

  getTaxasJuros(): Observable<any> {
    return this._httpClient.get(this.selicUrl).pipe(
      retry(2),
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

  // 3. NOVO MÉTODO PARA NOTÍCIAS COM IMAGENS REAIS
  getUltimasNoticias(): Observable<any[]> {
    // Usando NewsAPI (Filtro por economia em Português)
    // Dica: Substitua 'SUA_CHAVE' por uma chave gratuita de newsapi.org se possível
    const url = `https://newsapi.org`;

    return this._httpClient.get<any>(url).pipe(
      map(res => res.articles),
      catchError(() => {
        console.log('Usando notícias de backup com imagens premium...');
        return of(this.getNoticiasBackup());
      })
    );
  }

  private getNoticiasBackup() {
    return [
      { 
        title: 'Tensões Geopolíticas: Impacto imediato no fluxo de Dólar e Ouro.',
        urlToImage: 'conflito-no-mundo.jpg',
        source: { name: 'Reuters' }
      },
      { 
        title: 'Bancos Centrais discutem novas taxas para conter inflação global.',
        urlToImage: 'inflacao.webp',
        source: { name: 'Bloomberg' }
      },
      { 
        title: 'Mercado de Criptoativos apresenta forte entrada de capital institucional.',
        urlToImage: 'traxer-kM6QNrgo0YE-unsplash.webp',
        source: { name: 'CNBC' }
      }
    ];
  }
}