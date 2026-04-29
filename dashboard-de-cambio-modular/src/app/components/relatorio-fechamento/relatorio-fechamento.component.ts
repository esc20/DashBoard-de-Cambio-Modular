import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService, MoedaExibicao } from '../../currency.service';

// INTERFACE DE CONTRATO (Padrão Sênior: Define a estrutura do relatório calculado)
interface RelatorioMercado {
  topGanho: MoedaExibicao;
  topPerda: MoedaExibicao;
  totalAtivos: number;
  climaMercado: 'Otimista' | 'Cauteloso';
}

@Component({
  selector: 'app-relatorio-fechamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorio-fechamento.component.html',
  styleUrl: './relatorio-fechamento.component.scss',
  // Adicionado OnPush para máxima performance
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelatorioFechamentoComponent {
  private readonly currencyService = inject(CurrencyService);

  readonly today: Date = new Date(); 
  exibirExplicacao = signal<boolean>(false);

  // TIPAGEM: computed agora sabe exatamente que retorna RelatorioMercado ou null
  relatorio = computed<RelatorioMercado | null>(() => {
    const moedas = this.currencyService.listaMoedas();
    if (moedas.length === 0) return null;

    // Ordena pela variação (Lógica Sênior: imutabilidade com spread operator)
    const ordenadas = [...moedas].sort((a, b) => 
      (a.valor / a.anterior) - (b.valor / b.anterior)
    );

    return {
      topGanho: ordenadas[0],
      topPerda: ordenadas[ordenadas.length - 1],
      totalAtivos: moedas.length,
      // Lógica de negócio: se mais da metade das moedas valorizou (valor caiu vs USD), clima é Otimista
      climaMercado: ordenadas.filter(m => m.valor < m.anterior).length > moedas.length / 2 
        ? 'Otimista' 
        : 'Cauteloso'
    };
  });

  toggleExplicacao(): void {
    this.exibirExplicacao.update(v => !v);
  }
}
