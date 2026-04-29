import { Component, signal, inject, OnInit, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CurrencyService, SentimentResponse, SentimentData } from '../../currency.service';

@Component({
  selector: 'app-sentimento-mercado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sentimento-mercado.component.html',
  styleUrl: './sentimento-mercado.component.scss',
  // Pilar de Performance: OnPush
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SentimentoMercadoComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _currencyService = inject(CurrencyService);

  valorSentimento = signal<number>(0); 
  exibirExplicacao = signal<boolean>(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.buscarDadosReais();
      // Atualização a cada 30 minutos
      setInterval(() => this.buscarDadosReais(), 1800000);
    }
  }

  toggleExplicacao(): void {
    this.exibirExplicacao.update(v => !v);
  }

  private buscarDadosReais(): void {
    // TIPAGEM FORTE: Usando a interface que definimos no Service
    this._currencyService.getMarketSentiment().subscribe({
      next: (res: SentimentResponse | { data: SentimentData[] }) => {
        if (res.data && res.data[0]) {
          const valorApi = Number(res.data[0].value);
          this.valorSentimento.set(valorApi);
        }
      },
      error: (err: Error) => console.error('Erro ao buscar sentimento:', err.message)
    });
  }

  calcularOffset(): number {
    const valor = this.valorSentimento(); 
    const maxDash = 215;
    return maxDash - (valor / 100) * maxDash;
  }

  obterCorStatus(): string {
    const v = this.valorSentimento();
    if (v === 0) return 'rgba(255,255,255,0.2)';
    if (v < 30) return '#ff4444'; 
    if (v < 60) return '#ffff00'; 
    return '#00ff88'; 
  }

  obterStatusTexto(): string {
    const v = this.valorSentimento();
    if (v < 30) return 'Medo Extremo';
    if (v < 45) return 'Medo';
    if (v < 55) return 'Neutro';
    if (v < 75) return 'Ganância';
    return 'Ganância Extrema';
  }
}
