import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CurrencyService } from '../../currency.service'; // Verifique o caminho

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private currencyService = inject(CurrencyService); // Injeção do serviço

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

  // MÉTODO QUE ENVIA A BUSCA PARA O MAPA
  dispararBusca(event: any) {
    const termo = event.target.value;
    if (termo) {
      this.currencyService.termoBusca.set(termo);
      // Opcional: fecha a barra após buscar
      // this.exibirBusca.set(false); 
    }
  }
}
