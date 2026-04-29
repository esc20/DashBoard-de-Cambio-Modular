import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DecimalPipe } from '@angular/common';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Como o componente é Standalone, ele entra em imports
      imports: [CardComponent], 
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DecimalPipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    
    // Simula que estamos no navegador para o ngOnInit rodar sem erros
    fixture.detectChanges(); 
  });

  // TESTE 1: O Básico (Sanity Check)
  it('deve criar o componente corretamente', () => {
    expect(component).toBeTruthy();
  });

  // TESTE 2: Lógica de Conversão (O que o recrutador quer ver)
  it('deve atualizar o valor de conversão quando o input mudar', () => {
    const inputEvent = { target: { value: '10' } } as any;
    component.atualizarValorConversao(inputEvent);
    
    // Verifica se o Signal foi atualizado para 10
    expect(component.valorParaConverter()).toBe(10);
  });

  // TESTE 3: Tratamento de erro no input
  it('deve definir o valor como 0 se o input for inválido', () => {
    const inputEvent = { target: { value: 'abc' } } as any;
    component.atualizarValorConversao(inputEvent);
    
    expect(component.valorParaConverter()).toBe(0);
  });
});
