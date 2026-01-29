import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// 👇 Importamos 'withInterceptors' (sin el FromDi)
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// 👇 IMPORTANTE: Importa tu interceptor. 
// Revisa que la ruta sea correcta según donde guardaste el archivo anterior.
import { authInterceptor } from '../app/interceptors/auth.interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // 👇 AQUÍ ESTÁ EL CAMBIO MÁGICO
    // En lugar de withInterceptorsFromDi(), usamos withInterceptors passing el tuyo
    provideHttpClient(withInterceptors([authInterceptor])), 
    
    provideAnimations(),
    importProvidersFrom(FormsModule),
  ]
};