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

  // Lista de juros com valores base (o Brasil será atualizado pela API)
  taxas = signal([
    { pais: 'Brasil', sigla: 'SELIC', valor: 0, cor: '#00ff88' },
    { pais: 'EUA', sigla: 'FED', valor: 5.50, cor: '#3b82f6' },
    { pais: 'Europa', sigla: 'BCE', valor: 4.50, cor: '#f59e0b' }
  ]);

  ngOnInit() {
    this.carregarJurosReais();
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
      console.error('Erro CORS na SELIC, usando valor fixo atualizado');
      this.atualizarValorBrasil(10.75); // Valor atual da SELIC
    }
  });
}

private atualizarValorBrasil(valor: number) {
  this.taxas.update(lista => lista.map(t => 
    t.pais === 'Brasil' ? { ...t, valor: valor } : t
  ));
}
}