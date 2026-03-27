import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyData, CurrencyService } from '../../currency.service';



@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent  {
    postsList: CurrencyData[] = [];

    readonly _currencyService = inject(CurrencyService);

    ngOnInit() {
      this._currencyService.getPost().subscribe(
        (response) => { 
          console.log('Response: ', response); 

          this.postsList = response
        }
      )
    }

   moedas =  [
    { nome: 'Brasil', sigla: 'BRL', valor: 1.00, tendencia: 'estavel', bandeira: 'Flag_of_Brazil.svg' },
    { nome: 'EUA', sigla: 'USD', valor: 0, tendencia: 'subindo', bandeira: 'Flag_of_the_United_States.svg' },
    { nome: 'Japão', sigla: 'JPY', valor: 0, tendencia: 'caindo', bandeira: 'Flag_of_Japan.svg' },
    { nome: 'Alemanha', sigla: 'DEU', valor: 0, tendencia: 'caindo', bandeira: 'Flag_of_Germany.svg.png' },
    { nome: 'Grã-Bretanha', sigla: 'UKX', valor: 0, tendencia: 'estavel', bandeira: 'Flag_of_Great_Britain_(1707–1800).svg.png'},
    { nome: 'China', sigla: 'CHN', valor: 0, tendencias: 'subindo', bandeira: 'Flag_of_China.jpg'} 
  ];
}
