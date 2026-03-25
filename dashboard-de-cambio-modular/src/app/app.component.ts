import { Component, signal, inject, OnInit, DestroyRef, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize } from 'rxjs/operators';
import { ArrayPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { of } from 'rxjs';

/**
 * Interface para a resposta da API de Câmbio
 */
interface ExchangeRateResponse {
  result: string;
  base_code: string;
  conversion_rates: { [key: string]: number };
}

/**
 * Componente Secundário: Lista de Moedas Populares
 * Definido como standalone para ser usado no AppComponent
 */
@Component({
  selector: 'app-moeda-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      @for (moeda of moedas; track moeda.sigla) {
        <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <span class="text-3xl" role="img" [attr.aria-label]="moeda.nome">{{ getFlag(moeda.sigla) }}</span>
          <div class="flex-1">
            <h3 class="font-bold text-gray-700 text-sm leading-tight">{{ moeda.nome }}</h3>
            <p class="text-xs text-gray-400 font-mono">{{ moeda.sigla }}</p>
          </div>
          <div class="text-right">
            <p class="font-mono font-bold text-indigo-600">
              {{ moeda.valor | currency:'BRL':'R$ ' }}
            </p>
            <span class="text-[10px] uppercase font-black" 
                  [class.text-green-500]="moeda.tendencia === 'subindo'"
                  [class.text-red-500]="moeda.tendencia === 'caindo'">
              {{ moeda.tendencia }}
            </span>
          </div>
        </div>
      }
    </div>
  `
})
class MoedaCardComponent {
  moedas = [
    { nome: 'Dólar Americano', sigla: 'USD', valor: 5.42, tendencia: 'subindo' },
    { nome: 'Euro', sigla: 'EUR', valor: 5.88, tendencia: 'caindo' },
    { nome: 'Iene Japonês', sigla: 'JPY', valor: 0.035, tendencia: 'estável' },
    { nome: 'Libra Esterlina', sigla: 'GBP', valor: 6.95, tendencia: 'subindo' },
    { nome: 'Yuan Chinês', sigla: 'CNY', valor: 0.75, tendencia: 'subindo' },
    { nome: 'Peso Argentino', sigla: 'ARS', valor: 0.005, tendencia: 'caindo' }
  ];

  getFlag(sigla: string): string {
    const flags: Record<string, string> = {
      'USD': '🇺🇸', 'EUR': '🇪🇺', 'JPY': '🇯🇵', 
      'GBP': '🇬🇧', 'CNY': '🇨🇳', 'ARS': '🇦🇷'
    };
    return flags[sigla] || '🏳️';
  }
}

/**
 * Componente Principal: AppComponent
 * Responsável pela lógica de negócio e integração com API
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MoedaCardComponent],
  template: `
    <div class="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div class="max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        <!-- Header -->
        <header class="mb-10 text-center md:text-left">
          <div class="inline-block p-2 bg-indigo-100 rounded-lg mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="Path d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'" />
            </svg>
          </div>
          <h1 class="text-4xl font-extrabold tracking-tight text-slate-900">Conversor Pro</h1>
          <p class="mt-2 text-lg text-slate-500">Dados do mercado financeiro em tempo real via API.</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Seção de Conversão Principal -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 border border-indigo-50">
              <div class="flex flex-col md:flex-row gap-6 items-end">
                
                <div class="flex-1 w-full">
                  <label class="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Valor de Origem (USD)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="number" 
                      [value]="amount()"
                      (input)="updateAmount($event)"
                      placeholder="0.00"
                      class="w-full pl-8 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-2xl font-black focus:border-indigo-500 focus:bg-white outline-none transition-all">
                  </div>
                </div>

                <div class="hidden md:flex items-center justify-center p-4">
                  <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

                <div class="flex-1 w-full">
                  <label class="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Resultado em BRL</label>
                  <div class="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                    <div class="text-xs font-medium opacity-80">Conversão Estimada</div>
                    <div class="text-3xl font-black">
                      {{ displayValue() | currency:'BRL':'R$ ' }}
                    </div>
                  </div>
                </div>

              </div>

              <!-- Status da API -->
              <div class="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                  <div [class]="isLoading() ? 'bg-amber-400 animate-pulse' : 'bg-green-500'" class="w-2.5 h-2.5 rounded-full"></div>
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    {{ isLoading() ? 'Sincronizando...' : 'Taxas Atualizadas' }}
                  </span>
                </div>
                
                @if (errorMessage()) {
                  <div class="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                    <span class="text-[10px] font-bold uppercase">{{ errorMessage() }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Listagem de Moedas -->
            <div>
              <h2 class="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                Outras Cotações
                <span class="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-500 uppercase">Mock Data</span>
              </h2>
              <app-moeda-card></app-moeda-card>
            </div>
          </div>

          <!-- Sidebar Informativa -->
          <div class="space-y-6">
            <div class="bg-indigo-900 rounded-3xl p-6 text-white overflow-hidden relative">
              <div class="relative z-10">
                <h3 class="font-bold text-lg mb-2">Dica de Investimento</h3>
                <p class="text-indigo-200 text-sm leading-relaxed">
                  Acompanhe as variações do dólar diariamente para planejar suas compras internacionais ou investimentos em fundos cambiais.
                </p>
                <button class="mt-4 w-full py-3 bg-white text-indigo-900 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-colors">
                  Ver Histórico Completo
                </button>
              </div>
              <!-- Decorativo -->
              <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-800 rounded-full opacity-50"></div>
            </div>

            <div class="p-6 border-2 border-dashed border-slate-200 rounded-3xl">
              <h4 class="font-bold text-slate-700 text-sm mb-3">Configuração de API</h4>
              <p class="text-xs text-slate-500 mb-4">Para obter dados reais, você deve inserir sua chave da <a href="https://www.exchangerate-api.com/" class="text-indigo-600 underline">ExchangeRate-API</a> no código fonte.</p>
              <div class="text-[10px] font-mono bg-slate-100 p-2 rounded text-slate-400 break-all">
                v6.exchangerate-api.com/v6/SUA_CHAVE/...
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  `]
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  // Estados com Signals
  amount = signal<number>(1);
  rates = signal<Record<string, number>>({});
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Derivado: Valor convertido
  displayValue = computed(() => {
    const rate = this.rates()['BRL'];
    return rate ? this.amount() * rate : 0;
  });

  // IMPORTANTE: Insira sua chave aqui para ver funcionando com dados reais
  private readonly API_KEY = ''; 

  ngOnInit(): void {
    this.fetchRates();
  }

  fetchRates(): void {
    if (!this.API_KEY) {
      this.errorMessage.set('API KEY Ausente');
      // Mock inicial apenas para visualização
      this.rates.set({ 'BRL': 5.42 });
      return;
    }

    this.isLoading.set(true);
    const url = `https://v6.exchangerate-api.com/v6/${this.API_KEY}/latest/USD`;

    this.http.get<ExchangeRateResponse>(url)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          this.errorMessage.set('Erro na Conexão');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(data => {
        if (data?.result === 'success') {
          this.rates.set(data.conversion_rates);
          this.errorMessage.set(null);
        }
      });
  }

  updateAmount(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.amount.set(Number(input.value) || 0);
  }
}