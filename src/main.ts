// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // si usas Angular Material o daisyUI
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; // SOLUCIÓN CLAVE

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(BrowserModule) // 💡 ESTA LÍNEA evita el error del DocumentToken
  ]
}).catch(err => console.error(err));
