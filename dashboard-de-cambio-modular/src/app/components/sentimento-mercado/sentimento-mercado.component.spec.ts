import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentoMercadoComponent } from './sentimento-mercado.component';

describe('SentimentoMercadoComponent', () => {
  let component: SentimentoMercadoComponent;
  let fixture: ComponentFixture<SentimentoMercadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentimentoMercadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentimentoMercadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
