import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {CurrencyService, ExchangeRateResponse } from '../../currency.service';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngFor="let moeda of moedas()">
      <p>{{ moeda.nome }} ({{ moeda.sigla }}): {{ moeda.valor | number:'1.2-2' }}</p>
    </div>
  `
})
export class AppComponent implements OnInit {
  private readonly _currencyService = inject(CurrencyService);
  private readonly _decimalPipe = inject(DecimalPipe);

  // Lista de moedas inicializada como Signal
  moedas = signal<MoedaInfo[]>([
    { nome: 'Brasil', sigla: 'BRL', valor: 0, tendencia: 'estavel', bandeira: 'br' },
    { nome: 'EUA', sigla: 'USD', valor: 1.00, tendencia: 'estavel', bandeira: 'us' },
    { nome: 'Japão', sigla: 'JPY', valor: 0, tendencia: 'estavel', bandeira: 'jp' },
    { nome: 'Alemanha', sigla: 'EUR', valor: 0, tendencia: 'estavel', bandeira: 'eu' },
    { nome: 'Grã-Bretanha', sigla: 'GBP', valor: 0, tendencia: 'estavel', bandeira: 'gb' },
    { nome: 'China', sigla: 'CNY', valor: 0, tendencia: 'estavel', bandeira: 'cn' } 
  ]);

  ngOnInit() {
    this.atualizarCotacoes();
  }

  atualizarCotacoes() {
    this._currencyService.getRates().subscribe({
      next: (response: ExchangeRateResponse) => {
        const taxas = response.conversion_rates;
        
        this.moedas.update(lista => 
          lista.map(moeda => {
            const novoValor = taxas[moeda.sigla] || moeda.valor;
            let novaTendencia: 'subindo' | 'caindo' | 'estavel' = 'estavel';

            if (moeda.valor !== 0) {
              if (novoValor > moeda.valor) novaTendencia = 'subindo';
              else if (novoValor < moeda.valor) novaTendencia = 'caindo';
            }

            return { ...moeda, valor: novoValor, tendencia: novaTendencia };
          })
        );
      },
      error: (err) => console.error('Falha ao carregar API:', err)
    });
  }

  getFlagCode(sigla: string): string {
    const codes: { [key: string]: string } = {
      'BRL': 'br', 'USD': 'us', 'JPY': 'jp', 'EUR': 'eu', 'GBP': 'gb', 'CNY': 'cn'
    };
    return codes[sigla] || 'un';
  }

  formatarValor(valor: number): string {
    return this._decimalPipe.transform(valor, '1.2-4') || '0.0000';
  }
}