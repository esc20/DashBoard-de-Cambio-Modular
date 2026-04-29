import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SentimentoMercadoComponent } from './sentimento-mercado.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CurrencyService } from '../../currency.service';
import { PLATFORM_ID } from '@angular/core';

describe('SentimentoMercadoComponent', () => {
  let component: SentimentoMercadoComponent;
  let fixture: ComponentFixture<SentimentoMercadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Como o componente é Standalone, ele entra em imports
      imports: [SentimentoMercadoComponent],
      providers: [
        CurrencyService,
        provideHttpClient(),
        provideHttpClientTesting(),
        // Garante que o teste saiba que está "no navegador" para rodar o OnInit
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SentimentoMercadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aciona o ngOnInit
  });

  // TESTE 1: Verifica se o componente carrega sem erros
  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  // TESTE 2: Verifica a lógica de texto baseada no valor do sentimento
  it('deve retornar "Medo Extremo" quando o valor for menor que 30', () => {
    component.valorSentimento.set(25);
    expect(component.obterStatusTexto()).toBe('Medo Extremo');
  });

  it('deve retornar "Ganância Extrema" quando o valor for maior que 75', () => {
    component.valorSentimento.set(80);
    expect(component.obterStatusTexto()).toBe('Ganância Extrema');
  });

  // TESTE 3: Verifica se o tooltip alterna o estado
  it('deve alternar a visibilidade da explicação ao chamar toggleExplicacao', () => {
    expect(component.exibirExplicacao()).toBeFalse();
    component.toggleExplicacao();
    expect(component.exibirExplicacao()).toBeTrue();
  });
});
