import { Component, OnInit, signal, inject, Injectable, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, retry, timer, switchMap } from 'rxjs';

// --- INTERFACES ---
export interface ExchangeRateResponse {
  result: string;
  base_code: string;
  conversion_rates: { [key: string]: number };
  time_last_update_utc: string;
}

interface MoedaExibicao {
  nome: string;
  sigla: string;
  valor: number;
  anterior: number;
}

// --- SERVIÇO DE CÂMBIO (CORRIGIDO E INTEGRADO) ---
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly _httpClient = inject(HttpClient);
  // Nota: Em produção, chaves de API devem ser protegidas no backend
  private readonly apiUrl = 'https://v6.exchangerate-api.com/v6/c1e5adfaf186943bf9b2e50f/latest/USD';

  getRates(): Observable<ExchangeRateResponse> {
    return this._httpClient.get<ExchangeRateResponse>(this.apiUrl).pipe(
      retry({ count: 3, delay: 2000 }) // Implementação de retry para robustez
    );
  }
}

// --- COMPONENTE PRINCIPAL ---
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
      <header class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-black tracking-tighter text-[#00ffff] uppercase">Financial Pulse</h1>
          <p class="text-gray-400 text-xs mt-1 uppercase tracking-widest">Global Market Intelligence</p>
        </div>
        <div class="text-right">
          <div class="text-[10px] text-gray-500 uppercase">Última Atualização</div>
          <div class="text-xs font-mono text-[#00ffff]">{{ ultimaAtualizacao() }}</div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- CARD DE CÂMBIO PRINCIPAL -->
        <div class="lg:col-span-1 bg-[#141414] border border-[#00ffff]/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,255,255,0.05)]">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-sm font-bold uppercase tracking-wider">Câmbio Real-Time</h2>
            <div class="w-2 h-2 rounded-full bg-[#00ffff] animate-pulse"></div>
          </div>

          <div class="space-y-4">
            @for (moeda of listaMoedas(); track moeda.sigla) {
              <div class="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-[#00ffff]/30">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full overflow-hidden border border-gray-700">
                    <img [src]="'https://flagcdn.com/w80/' + getFlagCode(moeda.sigla) + '.png'" 
                         class="w-full h-full object-cover" 
                         [alt]="moeda.sigla">
                  </div>
                  <div>
                    <div class="text-[10px] text-gray-500 font-bold uppercase">{{ moeda.nome }}</div>
                    <div class="text-sm font-bold">{{ moeda.sigla }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-mono font-bold" [class.text-green-400]="moeda.valor < moeda.anterior" [class.text-red-400]="moeda.valor > moeda.anterior">
                    {{ formatarValor(moeda.valor) }}
                  </div>
                  <div class="text-[9px] opacity-50">Base USD</div>
                </div>
              </div>
            } @empty {
              <div class="flex flex-col items-center justify-center py-12 opacity-20">
                <div class="w-8 h-8 border-2 border-[#00ffff] border-t-transparent rounded-full animate-spin mb-4"></div>
                <span class="text-xs uppercase tracking-widest">Sincronizando...</span>
              </div>
            }
          </div>
        </div>

        <!-- OUTROS WIDGETS (LAYOUT) -->
        <div class="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-[#141414] rounded-3xl p-6 border border-white/5 flex items-center justify-center min-h-[200px]">
             <span class="text-gray-600 uppercase text-xs tracking-widest font-bold">Market Sentiment Graph</span>
          </div>
          <div class="bg-[#141414] rounded-3xl p-6 border border-white/5 flex items-center justify-center min-h-[200px]">
             <span class="text-gray-600 uppercase text-xs tracking-widest font-bold">Interest Rate Cycles</span>
          </div>
          <div class="md:col-span-2 bg-[#ffff00] rounded-3xl p-6 text-black min-h-[150px]">
             <h3 class="text-sm font-black uppercase mb-4 tracking-tighter">Últimas Notícias do Mercado</h3>
             <div class="space-y-2">
               <div class="border-b border-black/10 pb-2 text-sm font-medium italic">"Fed sinaliza manutenção de taxas para o próximo trimestre..."</div>
               <div class="text-sm font-medium italic">"Mercados asiáticos fecham em alta com novos estímulos na China."</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #00ffff; border-radius: 10px; }
  `]
})
export class AppComponent implements OnInit {
  private readonly _currencyService = inject(CurrencyService);
  private readonly _decimalPipe = inject(DecimalPipe);

  // State
  listaMoedas = signal<MoedaExibicao[]>([]);
  ultimaAtualizacao = signal<string>('---');

  private moedasConfig = [
    { sigla: 'BRL', nome: 'Brasil' },
    { sigla: 'EUR', nome: 'União Europeia' },
    { sigla: 'GBP', nome: 'Reino Unido' },
    { sigla: 'JPY', nome: 'Japão' },
    { sigla: 'CNY', nome: 'China' },
    { sigla: 'BTC', nome: 'Bitcoin' }
  ];

  ngOnInit() {
    this.iniciarMonitoramento();
  }

  private iniciarMonitoramento() {
    // Atualiza a cada 60 segundos automaticamente
    timer(0, 60000).pipe(
      switchMap(() => this._currencyService.getRates())
    ).subscribe({
      next: (res) => {
        const taxas = res.conversion_rates;
        const novaLista = this.moedasConfig.map(cfg => {
          const valorAtual = taxas[cfg.sigla] || 0;
          const estadoAnterior = this.listaMoedas().find(m => m.sigla === cfg.sigla);
          return {
            ...cfg,
            valor: valorAtual,
            anterior: estadoAnterior ? estadoAnterior.valor : valorAtual
          };
        });

        this.listaMoedas.set(novaLista);
        this.ultimaAtualizacao.set(res.time_last_update_utc);
      },
      error: (err) => {
        console.error('Erro ao buscar câmbio:', err);
      }
    });
  }

  getFlagCode(sigla: string): string {
    const map: { [key: string]: string } = {
      'BRL': 'br', 'EUR': 'eu', 'GBP': 'gb', 'JPY': 'jp', 'CNY': 'cn', 'BTC': 'un'
    };
    return map[sigla] || 'un';
  }

  formatarValor(valor: number): string {
    return this._decimalPipe.transform(valor, '1.2-4') || '0.00';
  }
}