import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CurrencyService } from '../../currency.service';

@Component({
  selector: 'app-ciclo-de-juros',
  standalone: true,
  imports: [CommonModule],
  providers: [DecimalPipe],
  templateUrl: './ciclo-de-juros.component.html',
  styleUrl: './ciclo-de-juros.component.scss'
})
export class CicloDeJurosComponent implements OnInit {

  private readonly _currencyService = inject(CurrencyService);
  private readonly _decimalPipe = inject(DecimalPipe);

  // 1. SIGNAL PARA CONTROLE DO TOOLTIP
  exibirExplicacao = signal(false);

  // Lista de juros com valores base (o Brasil será atualizado pela API)
  taxas = signal([
    { pais: 'Brasil', sigla: 'SELIC', valor: 0, cor: '#00ff88' },
    { pais: 'EUA', sigla: 'FED', valor: 5.50, cor: '#3b82f6' },
    { pais: 'Europa', sigla: 'BCE', valor: 4.50, cor: '#f59e0b' },
    { pais: 'China', sigla: 'LPR', valor: 3.45, cor: '#ff4444' }, 
    { pais: 'Japão', sigla: 'BoJ', valor: 0.10, cor: '#ffffff' }
  ]);

  ngOnInit() {
    this.carregarJurosReais();
  }

  // 2. MÉTODO PARA ALTERNAR O TOOLTIP (Útil para cliques no mobile)
  toggleExplicacao() {
    this.exibirExplicacao.update(valor => !valor);
  }

  formatarTaxa(v: number): string {
    return this._decimalPipe.transform(v, '1.2-2') + '%';
  }

  private carregarJurosReais() {
    this._currencyService.getTaxasJuros().subscribe({
      next: (dados) => {
        if (dados && dados.length > 0) {
          const selicReal = parseFloat(dados[0].valor);
          this.atualizarValorBrasil(selicReal);
        }
      },
      error: (err) => {
        console.error('Erro na API SELIC, usando valor fixo de segurança');
        this.atualizarValorBrasil(10.75); 
      }
    });
  }

  private atualizarValorBrasil(valor: number) {
    this.taxas.update(lista => lista.map(t => 
      t.pais === 'Brasil' ? { ...t, valor: valor } : t
    ));
  }
}
