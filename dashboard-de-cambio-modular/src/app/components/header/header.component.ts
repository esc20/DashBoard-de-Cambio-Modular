import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CurrencyService } from '../../currency.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private currencyService = inject(CurrencyService);

  exibirBusca = signal(false);

  private readonly playlistImagens = [
    'federico-velazco-MZ8xoIQU4WQ-unsplash.jpg',
    'matt-nelson-z4X3yABcf5g-unsplash.jpg',
    'takashi-miyazaki-64ajtpEzlYc-unsplash.jpg'
  ];

  imagemAtual = signal(this.playlistImagens[0]);
  index = 0;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => {
        this.index = (this.index + 1) % this.playlistImagens.length;
        this.imagemAtual.set(this.playlistImagens[this.index]);
      }, 10000);
    }
  }

  alternarBusca() {
    this.exibirBusca.update(v => !v);
  }

  dispararBusca(event: any) {
    const input = event.target as HTMLInputElement;
    const termo = input.value.trim(); // Mantém o case original para o dicionário do mapa

    if (termo) {
      // 1. Atualiza o termo de busca no serviço
      this.currencyService.termoBusca.set(termo);
      
      // 2. O PULO DO GATO: Atualiza com Timestamp para garantir que o 'effect' rode sempre
      // Mesmo que o termo anterior seja igual ao atual (ex: Brasil -> Brasil)
      this.currencyService.triggerBusca.set(Date.now()); 

      // 3. Tenta fazer scroll se for um nome de Card (convertendo para minúsculo para bater no dicionário)
      this.scrollParaElemento(termo.toLowerCase());

      // 4. LIMPEZA IMEDIATA: Deixa o campo pronto para a próxima busca sem precisar de reload
      input.value = '';
    }
  }

  private scrollParaElemento(termo: string) {
    const dicionarioScroll: { [key: string]: string } = {
      'mapa': '.map-row',
      'noticias': '.col-noticias',
      'noticia': '.col-noticias',
      'juros': 'app-ciclo-de-juros',
      'fluxo': 'app-fluxo-ativos',
      'geopolitico': 'app-monitor-geopolitico',
      'guerra': 'app-monitor-geopolitico',
      'relatorio': 'app-relatorio-fechamento',
      'fechamento': 'app-relatorio-fechamento',
      'cambio': 'app-card',
      'moedas': 'app-card',
      'sentimento': 'app-sentimento-mercado'
    };

    const seletor = dicionarioScroll[termo];
    
    if (seletor) {
      const elemento = document.querySelector(seletor);
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        elemento.classList.add('highlight-search');
        setTimeout(() => elemento.classList.remove('highlight-search'), 2000);
      }
    }
  }
}
