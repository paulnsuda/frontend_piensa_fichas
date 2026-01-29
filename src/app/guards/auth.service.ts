import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // 👈 Asegúrate de que esta ruta sea correcta

export interface LoginResponse {
  access_token: string;
  user: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'token';
  
  // ✅ CORRECCIÓN APLICADA:
  // Usamos environment.apiUrl.
  // - En local leerá 'http://localhost:3000' (desde environment.ts)
  // - En Vercel leerá 'https://...railway.app' (desde environment.prod.ts)
  private readonly BASE = environment.apiUrl; 

  /* ---------------- ctor ---------------- */
  constructor(private http: HttpClient,
              private router: Router) {
      // 👇 Este log te servirá para confirmar en la consola del navegador a dónde se está conectando
      console.log('🔌 AuthService conectando a:', this.BASE);
  }

  /* --------------- end-points --------------- */
  
  login(dto: { email: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.BASE}/auth/login`, dto)
      .pipe(tap(res => this.saveToken(res.access_token)));
  }

  register(dto: any) {
    return this.http.post(`${this.BASE}/auth/register`, dto);
  }

  /* --------------- sesión --------------- */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigateByUrl('/login');
  }

  /* --------------- getters utils --------------- */
  getToken(): string | null {
    return this.token;
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const t = this.token;
    return !!t && this.isTokenValid(t);
  }

  getUserRole(): string | null {
    const t = this.token;
    if (!t || !this.isTokenValid(t)) { return null; }

    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return payload.role ?? payload.rol ?? null;
    } catch { return null; }
  }

  /* --------------- privados --------------- */
  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private isTokenValid(token: string): boolean {
    try {
      const [, payload] = token.split('.');
      JSON.parse(atob(payload));
      return true;
    } catch { return false; }
  }
}