import { Component, OnInit, signal, inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { timer, switchMap, retry } from 'rxjs';
import { CurrencyService, MoedaExibicao } from '../../currency.service'; // Ajuste o caminho conforme seu projeto

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './card.component.scss',
  templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {
  private readonly _currencyService = inject(CurrencyService);
  private readonly _decimalPipe = inject(DecimalPipe);
  private readonly platformId = inject(PLATFORM_ID);

  // 1. SIGNALS
  listaMoedas = signal<MoedaExibicao[]>([]);
  ultimaAtualizacao = signal<string>('---');
  exibirExplicacao = signal(false);

  private moedasConfig = [
    { sigla: 'BRL', nome: 'Brasil' },
    { sigla: 'USD', nome: 'Estados Unidos'},
    { sigla: 'EUR', nome: 'União Europeia' },
    { sigla: 'GBP', nome: 'Reino Unido' },
    { sigla: 'JPY', nome: 'Japão' },
    { sigla: 'CNY', nome: 'China' }
  ];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.iniciarMonitoramento();
    }
  }

  // 2. MÉTODOS DE AÇÃO
  toggleExplicacao() {
    this.exibirExplicacao.update(valor => !valor);
  }

  getFlagCode(sigla: string): string {
    const map: any = { 'BRL': 'br', 'USD': 'us', 'EUR': 'eu', 'GBP': 'gb', 'JPY': 'jp', 'CNY': 'cn' };
    return map[sigla] || 'un';
  }

  formatarValor(v: number) { 
    return this._decimalPipe.transform(v, '1.2-4'); 
  }

  private iniciarMonitoramento() {
    timer(0, 60000).pipe(
      switchMap(() => this._currencyService.getRates()),
      retry({ count: 3, delay: 2000 })
    ).subscribe({
      next: (res) => {
        const taxas = res.conversion_rates;
        
        // 1. Recupera o cache para comparação
        const cacheSalvo = localStorage.getItem('ultimas_taxas');
        const taxasAnteriores = cacheSalvo ? JSON.parse(cacheSalvo) : taxas; 

        // 2. Cria a lista processada (agora declarada corretamente como novasMoedas)
        const novasMoedas: MoedaExibicao[] = this.moedasConfig.map(cfg => {
          const valorReal = taxas[cfg.sigla] || 0;
          const valorSimulado = valorReal + (Math.random() * 0.0002 - 0.0001);
          const valorAnteriorNoCache = taxasAnteriores[cfg.sigla] || valorReal;

          return {
            ...cfg,
            valor: valorSimulado,
            anterior: valorAnteriorNoCache
          };
        });

        // 3. Atualiza os Signals (Local e Global para o Mapa)
        this.listaMoedas.set(novasMoedas);
        this._currencyService.listaMoedas.set(novasMoedas);
      
        // 4. Salva o novo estado no cache
        localStorage.setItem('ultimas_taxas', JSON.stringify(taxas));
        this.ultimaAtualizacao.set(new Date().toLocaleTimeString());
      },
      error: (err) => console.error('Erro na API de Câmbio:', err)
    });
  }
}