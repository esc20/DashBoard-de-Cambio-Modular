import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  private http = inject(HttpClient);

  private readonly API_KEY = 'SUA_CHAVE_AQUI';
  private readonly API_URL = 'https://v6.exchangerate-api.com/v6/${this.API_KEY}/latest/BRL'

   moedas =  [
    { nome: 'Brasil', sigla: 'BRL', valor: 1.00, tendencia: 'estavel', bandeira: 'Flag_of_Brazil.svg' },
    { nome: 'EUA', sigla: 'USD', valor: 0, tendencia: 'subindo', bandeira: 'Flag_of_the_United_States.svg' },
    { nome: 'Japão', sigla: 'JPY', valor: 0, tendencia: 'caindo', bandeira: 'Flag_of_Japan.svg' },
    { nome: 'Alemanha', sigla: 'DEU', valor: 0, tendencia: 'caindo', bandeira: 'Flag_of_Germany.svg.png' },
    { nome: 'Grã-Bretanha', sigla: 'UKX', valor: 0, tendencia: 'estavel', bandeira: 'Flag_of_Great_Britain_(1707–1800).svg.png'},
    { nome: 'China', sigla: 'CHN', valor: 0, tendencias: 'subindo', bandeira: 'Flag_of_China.jpg'} 
  ];
}
