import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { CardComponent } from './components/card/card.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ContentComponent, CardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
   moedas = [
    { nome: 'Brasil', sigla: 'BRL', valor: 1.00, tendencia: 'estavel', bandeira: 'Flag_of_Brazil.svg' },
    { nome: 'EUA', sigla: 'USD', valor: 5.40, tendencia: 'subindo', bandeira: 'Flag_of_USA.svg' },
    { nome: 'Japão', sigla: 'JPY', valor: 0.035, tendencia: 'caindo', bandeira: 'Flag_of_Japan.svg' }
  ];
}
