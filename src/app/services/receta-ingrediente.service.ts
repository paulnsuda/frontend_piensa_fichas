// src/app/services/receta-ingrediente.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecetaIngredienteService {
  private apiUrl = 'http://localhost:3000/recetas-ingredientes';

  constructor(private http: HttpClient) {}

  // Obtener todos los ingredientes de una receta
  getPorReceta(idReceta: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/receta/${idReceta}`);
  }

  // Obtener todos los ingredientes de todas las recetas
  getTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Agregar un ingrediente a una receta
  agregar(dto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  // Actualizar un ingrediente
  actualizar(idReceta: number, idIngrediente: number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idReceta}/${idIngrediente}`, dto);
  }

  // Eliminar un ingrediente de una receta
  eliminar(idReceta: number, idIngrediente: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${idReceta}/${idIngrediente}`);
  }
}
