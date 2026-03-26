import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private http = inject(HttpClient);

  
  private readonly API_KEY = 'YOUR_API_KEY'; 
  private readonly BASE_URL = `https://v6.exchangerate-api.com/v6/${this.API_KEY}/latest/USD`;

  
  getExchangeRates(): Observable<any> {
    return this.http.get(this.BASE_URL).pipe(
      map((response: any) => response.conversion_rates)
    );
  }
}