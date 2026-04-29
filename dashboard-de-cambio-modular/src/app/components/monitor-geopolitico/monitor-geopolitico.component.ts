import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// INTERFACE DE CONTRATO (Padrão Sênior: Define o que é um Alerta)
interface AlertaGeopolitico {
  status: 'CRÍTICO' | 'ATENÇÃO' | 'MONITORANDO'; // Literal types para segurança extra
  local: string;
  desc: string;
  cor: string;
}

@Component({
  selector: 'app-monitor-geopolitico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitor-geopolitico.component.html',
  styleUrl: './monitor-geopolitico.component.scss',
  // Adicionado OnPush para manter a consistência de performance
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorGeopoliticoComponent {
  exibirExplicacao = signal<boolean>(false);

  // Signal tipado com a interface criada
  alertas = signal<AlertaGeopolitico[]>([
    { 
      status: 'CRÍTICO', 
      local: 'Leste Europeu', 
      desc: 'Escalada de tensões impacta o suprimento de Gás Natural e a paridade do Euro.', 
      cor: '#ff4444' 
    },
    { 
      status: 'ATENÇÃO', 
      local: 'Mar do Sul da China', 
      desc: 'Novas manobras navais geram volatilidade no Iuan (CNY) e ativos asiáticos.', 
      cor: '#ffff00' 
    },
    { 
      status: 'MONITORANDO', 
      local: 'Oriente Médio', 
      desc: 'Reunião estratégica da OPEP+ pode redefinir o fluxo do Petróleo Brent.', 
      cor: '#00e5ff' 
    }
  ]);

  toggleExplicacao(): void {
    this.exibirExplicacao.update(v => !v);
  }
}
