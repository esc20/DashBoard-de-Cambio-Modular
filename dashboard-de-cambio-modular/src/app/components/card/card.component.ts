import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
   moedas = [
    { nome: 'Brasil', sigla: 'BRL', valor: 1.00, tendencia: 'estavel', bandeira: 'Flag_of_Brazil.svg' },
    { nome: 'EUA', sigla: 'USD', valor: 5.40, tendencia: 'subindo', bandeira: 'Flag_of_the_United_States.svg' },
    { nome: 'Japão', sigla: 'JPY', valor: 0.035, tendencia: 'caindo', bandeira: 'Flag_of_Japan.svg' },
    { nome: 'Alemanha', sigla: 'DEU', valor: 4.35, tendencia: 'caindo', bandeira: 'Flag_of_Germany.svg.png' },
    { nome: 'Grã-Bretanha', sigla: 'UKX', valor: 1.50, tendencia: 'estavel', bandeira: 'Flag_of_Great_Britain_(1707–1800).svg.png'},
    { nome: 'China', sigla: 'CHN', valor: 2.60, tendencias: 'subindo', bandeira: 'Flag_of_China.jpg'} 
  ];
}
