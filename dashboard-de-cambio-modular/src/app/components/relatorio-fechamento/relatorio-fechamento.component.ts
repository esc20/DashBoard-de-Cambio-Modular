import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common'; // Garante que o DatePipe funcione
import { CurrencyService } from '../../currency.service';

@Component({
  selector: 'app-relatorio-fechamento',
  standalone: true,
  imports: [CommonModule], // O CommonModule deve estar aqui
  templateUrl: './relatorio-fechamento.component.html',
  styleUrl: './relatorio-fechamento.component.scss'
})
export class RelatorioFechamentoComponent {
  private currencyService = inject(CurrencyService);

  // 1. Crie a variável today aqui para o HTML encontrar
  today: Date = new Date(); 

  relatorio = computed(() => {
    const moedas = this.currencyService.listaMoedas();
    if (moedas.length === 0) return null;

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
}