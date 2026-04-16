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

  // CORREÇÃO: URL direta de imagem (.jpg). O link antigo 'unsplash.com' era um site e causava erro.
  private readonly fallbackImg = 'https://unsplash.com';

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.iniciarAtualizacaoNoticias();
    }
  }

  private iniciarAtualizacaoNoticias() {
    // Configuramos para chamar a cada 1 hora (3600000 ms)
    // O timer(0, ...) garante que a primeira chamada aconteça IMEDIATAMENTE
    timer(0, 3600000).pipe(
      switchMap(() => this.newsService.getUltimasNoticias()),
      catchError((err) => {
        console.error('Erro no loop de notícias:', err);
        return of([]); // Retorna array vazio em caso de erro crítico para não quebrar o signal
      })
    ).subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          // Filtramos apenas notícias que tenham título
          const noticiasValidas = data.filter(n => n.title);
          this.noticias.set(noticiasValidas);
        }
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  // MÉTODO BLINDADO: Mata o loop de erro e garante que uma imagem apareça
  substituirImagemErro(event: Event) {
    const img = event.target as HTMLImageElement;
    
    // 1. Desliga o ouvinte de erro imediatamente para impedir o loop infinito
    img.onerror = null; 
    
    // 2. Substitui pela imagem de backup segura (Link real .jpg)
    if (img.src !== this.fallbackImg) {
      img.src = this.fallbackImg;
    }
  }
}