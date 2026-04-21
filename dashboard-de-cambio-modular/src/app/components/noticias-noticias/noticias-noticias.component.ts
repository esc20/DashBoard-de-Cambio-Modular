import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CurrencyService } from '../../currency.service';
import { timer, switchMap, catchError, of } from 'rxjs';

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
  exibirExplicacao = signal(false); // Novo signal para o Tooltip

  // LINK CORRIGIDO: Agora aponta para uma imagem real (.jpg)
  private readonly fallbackImg = 'https://unsplash.com';

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.iniciarAtualizacaoNoticias();
    }
  }

  toggleExplicacao() {
    this.exibirExplicacao.update(v => !v);
  }

  private iniciarAtualizacaoNoticias() {
    timer(0, 3600000).pipe(
      switchMap(() => this.newsService.getUltimasNoticias()),
      catchError(() => of([]))
    ).subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.noticias.set(data.filter(n => n.title));
        }
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  substituirImagemErro(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null; 
    if (img.src !== this.fallbackImg) {
      img.src = this.fallbackImg;
    }
  }
}
