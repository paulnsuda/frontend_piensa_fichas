// src/app/services/recetas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecetaService {
  private apiUrl = 'http://localhost:3000/recetas';

  constructor(private http: HttpClient) {}

  // ✅ Método correcto usado en cargarReceta()
  findById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Mostrar todas las recetas (si lo necesitas más adelante)
  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
