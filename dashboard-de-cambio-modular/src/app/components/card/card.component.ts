import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class CardComponent implements OnInit {
  private readonly _currencyService = inject(CurrencyService);

  // Usando Signal para melhor performance (opcional, mas recomendado no Angular 18+)
  moedas = signal([
    { nome: 'Brasil', sigla: 'BRL', valor: 0, tendencia: 'estavel', bandeira: 'Flag_of_Brazil.svg' },
    { nome: 'EUA', sigla: 'USD', valor: 1.00, tendencia: 'subindo', bandeira: 'Flag_of_the_United_States.svg' },
    { nome: 'Japão', sigla: 'JPY', valor: 0, tendencia: 'caindo', bandeira: 'Flag_of_Japan.svg' },
    { nome: 'Alemanha', sigla: 'EUR', valor: 0, tendencia: 'caindo', bandeira: 'Flag_of_Germany.svg.png' },
    { nome: 'Grã-Bretanha', sigla: 'GBP', valor: 0, tendencia: 'estavel', bandeira: 'Flag_of_Great_Britain.png'},
    { nome: 'China', sigla: 'CNY', valor: 0, tendencia: 'subindo', bandeira: 'Flag_of_China.jpg'} 
  ]);

  ngOnInit() {
    // Agora o 'response' terá o tipo ExchangeRateResponse automaticamente
    this._currencyService.getRates().subscribe({
      next: (response: ExchangeRateResponse) => {
        console.log('Dados recebidos com sucesso:', response);

        // Atualizamos os valores comparando as siglas
        const taxas = response.conversion_rates;
        
        this.moedas.update(listaAtual => 
          listaAtual.map(moeda => ({
            ...moeda,
            valor: taxas[moeda.sigla] || moeda.valor
          }))
        );
      },
      error: (err) => {
        console.error('Erro na requisição:', err);
      }
    });
  }
}