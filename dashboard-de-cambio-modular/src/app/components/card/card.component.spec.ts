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
      imports: [CardComponent], 
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DecimalPipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    
    
    fixture.detectChanges(); 
  });

  it('deve criar o componente corretamente', () => {
    expect(component).toBeTruthy();
  });


  it('deve atualizar o valor de conversão quando o input mudar', () => {
    const inputEvent = { target: { value: '10' } } as any;
    component.atualizarValorConversao(inputEvent);
    
    
    expect(component.valorParaConverter()).toBe(10);
  });

  
  it('deve definir o valor como 0 se o input for inválido', () => {
    const inputEvent = { target: { value: 'abc' } } as any;
    component.atualizarValorConversao(inputEvent);
    
    expect(component.valorParaConverter()).toBe(0);
  });
});
