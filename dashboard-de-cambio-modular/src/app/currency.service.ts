import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CurrencyData {
  nome: string;
  sigla: string;
  valor: number;
  imagem: string;
}

  
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly _httpClient = inject(HttpClient);

  
 getPost(): Observable<CurrencyData[]> {
  return this._httpClient.get<CurrencyData[]>('https://v6.exchangerate-api.com/v6/c1e5adfaf186943bf9b2e50f/latest/USD');
 }

  
  
}