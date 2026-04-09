import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Importe o withFetch
import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()), 
    provideHttpClient(withFetch()), // Adicionei a vírgula aqui
    provideEchartsCore({ echarts }),              // Agora o provideEcharts está correto
  ]
};
