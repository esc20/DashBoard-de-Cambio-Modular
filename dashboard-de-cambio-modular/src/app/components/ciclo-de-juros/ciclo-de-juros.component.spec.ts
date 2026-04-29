import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CicloDeJurosComponent } from './ciclo-de-juros.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CurrencyService } from '../../currency.service';

describe('CicloDeJurosComponent', () => {
  let component: CicloDeJurosComponent;
  let fixture: ComponentFixture<CicloDeJurosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CicloDeJurosComponent],
      providers: [
        CurrencyService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CicloDeJurosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
