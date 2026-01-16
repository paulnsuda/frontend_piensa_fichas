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
  
  // 🔴 CORRECCIÓN AQUÍ:
  // Forzamos la dirección local para desarrollo.
  // Cuando subas a producción, descomenta la segunda línea y comenta la primera.
  private readonly BASE = 'http://localhost:3000'; 
  // private readonly BASE = environment.apiUrl; 

  /* ---------------- ctor ---------------- */
  constructor(private http: HttpClient,
              private router: Router) {}

  /* --------------- end-points --------------- */
  
  // Como tu controller tiene @Controller('auth'), la ruta base es /auth
  
  login(dto: { email: string; password: string }): Observable<LoginResponse> {
    // Esto generará: http://localhost:3000/auth/login
    return this.http
      .post<LoginResponse>(`${this.BASE}/auth/login`, dto)
      .pipe(tap(res => this.saveToken(res.access_token)));
  }

  register(dto: any) {
    // Esto generará: http://localhost:3000/auth/register
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
      // Soporte para ambos nombres de campo por si acaso
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