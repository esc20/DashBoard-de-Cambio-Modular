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
  exibirExplicacao = signal(false); // Signal de controle do Tooltip

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.buscarDadosReais();
      setInterval(() => this.buscarDadosReais(), 1800000);
    }
  }

  toggleExplicacao() {
    this.exibirExplicacao.update(v => !v);
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

  obterCorStatus() {
    const v = this.valorSentimento();
    if (v === 0) return 'rgba(255,255,255,0.2)';
    if (v < 30) return '#ff4444'; 
    if (v < 60) return '#ffff00'; 
    return '#00ff88'; 
  }

  obterStatusTexto() {
    const v = this.valorSentimento();
    if (v < 30) return 'Medo Extremo';
    if (v < 45) return 'Medo';
    if (v < 55) return 'Neutro';
    if (v < 75) return 'Ganância';
    return 'Ganância Extrema';
  }
}
