// src/app/services/receta.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecetaService {
  private apiUrl = 'http://localhost:3000/recetas'; // cambia si tu backend está en otro host

  constructor(private http: HttpClient) {}

  // Obtener todas las recetas
  getRecetas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener una receta por ID
  getReceta(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear una receta
  crearReceta(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Editar una receta
  actualizarReceta(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar una receta
  eliminarReceta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

