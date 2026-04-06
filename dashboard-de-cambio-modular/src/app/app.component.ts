import { Component } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { HeaderComponent } from './components/header/header.component';
import { SentimentoMercadoComponent } from './components/sentimento-mercado/sentimento-mercado.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CardComponent, HeaderComponent, SentimentoMercadoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dashboard-de-cambio-modular';
}