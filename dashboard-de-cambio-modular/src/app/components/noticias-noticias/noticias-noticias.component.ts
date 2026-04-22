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

  // Fallback de segurança máxima (Link direto de imagem)
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
    // Carrega instantaneamente os dados estratégicos do Service
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
    img.onerror = null; 
    img.src = this.fallbackImg;
  }
}
