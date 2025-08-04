// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router }      from '@angular/router';
import { tap, Observable } from 'rxjs';
import { environment }     from '../../environments/environment';

export interface LoginResponse {
  access_token: string;
  user:        any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'token';
  private readonly BASE      = environment.apiUrl;  // https://backend-piensa-fichas.onrender.com

  /* ---------------- ctor ---------------- */
  constructor(private http: HttpClient,
              private router: Router) {}

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
  /** Nuevo wrapper para código legado (interceptores, etc.) */
  getToken(): string | null {              // 👈 añadido
    return this.token;
  }

  /** Getter moderna (puedes usarla directamente) */
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
