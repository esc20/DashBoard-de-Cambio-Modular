import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SentimentoMercadoComponent } from './sentimento-mercado.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CurrencyService } from '../../currency.service';
import { PLATFORM_ID } from '@angular/core';

describe('SentimentoMercadoComponent', () => {
  let component: SentimentoMercadoComponent;
  let fixture: ComponentFixture<SentimentoMercadoComponent>;
  let currencyService: CurrencyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentimentoMercadoComponent],
      providers: [
        CurrencyService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();


    currencyService = TestBed.inject(CurrencyService);    
    fixture = TestBed.createComponent(SentimentoMercadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve retornar "Medo Extremo" quando o percentual de moedas em alta for menor que 20%', () => {
    currencyService.listaMoedas.set([
      { nome: 'M1', sigla: 'M1', valor: 5.0, anterior: 5.0 },
      { nome: 'M2', sigla: 'M2', valor: 5.0, anterior: 5.0 },
      { nome: 'M3', sigla: 'M3', valor: 5.0, anterior: 5.0 },
      { nome: 'M4', sigla: 'M4', valor: 5.0, anterior: 5.0 },
      { nome: 'M5', sigla: 'M5', valor: 5.0, anterior: 5.0 }
    ]);
    
    
    fixture.detectChanges(); 
    expect(component.valorSentimento()).toBe(0); 
    expect(component.obterStatusTexto()).toBe('Medo Extremo');
  });

  it('deve retornar "Ganância Extrema" quando o percentual de moedas em alta for maior que 80%', () => {
    currencyService.listaMoedas.set([
      { nome: 'M1', sigla: 'M1', valor: 4.9, anterior: 5.0 },
      { nome: 'M2', sigla: 'M2', valor: 4.9, anterior: 5.0 },
      { nome: 'M3', sigla: 'M3', valor: 4.9, anterior: 5.0 },
      { nome: 'M4', sigla: 'M4', valor: 4.9, anterior: 5.0 },
      { nome: 'M5', sigla: 'M5', valor: 4.9, anterior: 5.0 }
    ]);
    
    fixture.detectChanges();
    
    expect(component.valorSentimento()).toBe(100);
    expect(component.obterStatusTexto()).toBe('Ganância Extrema');
  });

  it('deve alternar a visibilidade da explicação ao chamar toggleExplicacao', () => {
    expect(component.exibirExplicacao()).toBeFalse();
    component.toggleExplicacao();
    expect(component.exibirExplicacao()).toBeTrue();
  });
});
