import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sentimento-mercado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sentimento-mercado.component.html',
  styleUrl: './sentimento-mercado.component.scss'
})
export class SentimentoMercadoComponent {
  // 1. O Signal fica aqui no topo
  valorSentimento = signal<number>(72); 

  // 2. Método de cálculo do arco
  calcularOffset() {
    const valor = this.valorSentimento(); 
    const maxDash = 215;
    return maxDash - (valor / 100) * maxDash;
  }

  // 3. Método para definir a cor dinâmica
  obterCorStatus() {
    const v = this.valorSentimento();
    if (v < 30) return '#ff4444'; // Vermelho
    if (v < 60) return '#ffff00'; // Amarelo
    return '#00ff88'; // Verde
  }

  // 4. Método para o texto dinâmico
  obterStatusTexto() {
    const v = this.valorSentimento();
    if (v < 30) return 'Medo Extremo';
    if (v < 45) return 'Medo';
    if (v < 55) return 'Neutro';
    if (v < 75) return 'Ganância';
    return 'Ganância Extrema';
  }
}