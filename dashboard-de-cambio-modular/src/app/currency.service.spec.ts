import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrencyService,
        provideHttpClient(),
        provideHttpClientTesting() // Simula o back-end para o teste ser rápido e isolado
      ]
    });
    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Garante que não fiquem requisições abertas após cada teste
  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });

  it('deve processar as taxas de câmbio corretamente ao receber dados da API', () => {
    const mockResponse = {
      result: 'success',
      conversion_rates: { 'BRL': 5.50, 'EUR': 0.92 }
    };

    service.getRates().subscribe(res => {
      expect(res.conversion_rates['BRL']).toBe(5.50);
      expect(res.conversion_rates['EUR']).toBe(0.92);
    });

    // Intercepta a chamada para a URL da API (usando a propriedade privada via string para o TS não reclamar)
    const req = httpMock.expectOne((service as any).apiUrl);
    expect(req.request.method).toBe('GET');
    
    // Responde com os dados fake
    req.flush(mockResponse);
  });

  it('deve retornar notícias de backup se a API de notícias falhar', (done) => {
    service.getUltimasNoticias().subscribe(noticias => {
      expect(noticias.length).toBeGreaterThan(0);
      expect(noticias[0].title).toBeDefined();
      done(); // Avisa o Jasmine que o teste assíncrono terminou
    });
  });
});
