import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../currency.service';

@Component({
  selector: 'app-relatorio-fechamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorio-fechamento.component.html',
  styleUrl: './relatorio-fechamento.component.scss'
})
export class RelatorioFechamentoComponent {
  private currencyService = inject(CurrencyService);

  today: Date = new Date(); 
  exibirExplicacao = signal(false); // Controle do Tooltip

  relatorio = computed(() => {
    const moedas = this.currencyService.listaMoedas();
    if (moedas.length === 0) return null;

    // Ordena pela variação percentual
    const ordenadas = [...moedas].sort((a, b) => 
      (a.valor / a.anterior) - (b.valor / b.anterior)
    );

    return {
      topGanho: ordenadas[0],
      topPerda: ordenadas[ordenadas.length - 1],
      totalAtivos: moedas.length,
      climaMercado: ordenadas.filter(m => m.valor < m.anterior).length > moedas.length / 2 ? 'Otimista' : 'Cauteloso'
    };
  });

  toggleExplicacao() {
    this.exibirExplicacao.update(v => !v);
  }
}
