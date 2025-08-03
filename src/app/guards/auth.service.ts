import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<{ access_token: string, user: any }>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.access_token);
        })
      );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, data);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    window.location.href = '/login'; // Redirigir al login tras cerrar sesión
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && this.isTokenValid(token);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token || !this.isTokenValid(token)) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || payload.rol || null;
    } catch (e) {
      console.error('Error al decodificar token:', e);
      return null;
    }
  }

  private isTokenValid(token: string): boolean {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    try {
      const payload = atob(parts[1]);
      JSON.parse(payload); // lanza error si no es un JSON válido
      return true;
    } catch (e) {
      console.error('Token inválido:', e);
      return false;
    }
  }
}
