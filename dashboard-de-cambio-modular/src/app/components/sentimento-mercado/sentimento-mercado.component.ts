import { Component, signal, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CurrencyService } from '../../currency.service';

@Component({
  selector: 'app-sentimento-mercado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sentimento-mercado.component.html',
  styleUrl: './sentimento-mercado.component.scss'
})
export class SentimentoMercadoComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private readonly _currencyService = inject(CurrencyService);

  valorSentimento = signal<number>(0); 
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    this.buscarDadosReais();
    setInterval(() => this.buscarDadosReais(), 1800000);
  }
}

   private buscarDadosReais() {
    this._currencyService.getMarketSentiment().subscribe({
      next: (res: any) => {
        if (res.data && res.data[0]) {
          const valorApi = Number(res.data[0].value);
          this.valorSentimento.set(valorApi);
        }
      },
      error: (err) => console.error('Erro ao buscar sentimento:', err)
    });
  }
  calcularOffset() {
    const valor = this.valorSentimento(); 
    const maxDash = 215;
    return maxDash - (valor / 100) * maxDash;
  }

  // 3. Método para definir a cor dinâmica
  obterCorStatus() {
    const v = this.valorSentimento();
    if (v === 0) return 'rgba(255,255,255,0.2)'; // Cor de "carregando"
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