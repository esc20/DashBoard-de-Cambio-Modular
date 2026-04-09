import { Component } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { HeaderComponent } from './components/header/header.component';
import { SentimentoMercadoComponent } from './components/sentimento-mercado/sentimento-mercado.component';
import { CicloDeJurosComponent } from './components/ciclo-de-juros/ciclo-de-juros.component';
import { MapaMundiComponent } from './components/mapa-mundi/mapa-mundi.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CardComponent, HeaderComponent, SentimentoMercadoComponent, CicloDeJurosComponent, MapaMundiComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dashboard-de-cambio-modular';
}