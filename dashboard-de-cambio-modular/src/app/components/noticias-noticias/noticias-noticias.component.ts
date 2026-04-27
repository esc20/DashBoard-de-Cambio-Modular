import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CurrencyService } from '../../currency.service';

@Component({
  selector: 'app-noticias-noticias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './noticias-noticias.component.html',
  styleUrl: './noticias-noticias.component.scss'
})
export class NoticiasNoticiasComponent implements OnInit {
  private newsService = inject(CurrencyService);
  private platformId = inject(PLATFORM_ID);

  noticias = signal<any[]>([]);
  carregando = signal(true);
  exibirExplicacao = signal(false);

  // AJUSTE: Link direto para uma imagem genérica de finanças (Source Unsplash)
  private readonly fallbackImg = 'https://unsplash.com';

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.carregarNoticiasSimuladas();
    }
  }

  toggleExplicacao() {
    this.exibirExplicacao.update(v => !v);
  }

  private carregarNoticiasSimuladas() {
    this.newsService.getUltimasNoticias().subscribe({
      next: (data) => {
        this.noticias.set(data);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  substituirImagemErro(event: Event) {
    const img = event.target as HTMLImageElement;
    // Evita loop infinito caso a imagem de fallback também falhe
    if (img.src !== this.fallbackImg) {
      img.src = this.fallbackImg;
    }
  }
}
