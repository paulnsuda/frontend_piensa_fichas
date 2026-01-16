// src/app/services/recetas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';   // 👈 importa env

@Injectable({ providedIn: 'root' })
export class RecetaService {

  /* URL base dinámica (dev → localhost, prod → Render) */
  private apiUrl = `${environment.apiUrl}/recetas`;

  constructor(private http: HttpClient) {}

  /* ---------- CRUD ---------- */
  /** Obtener una receta por ID (usado en cargarReceta) */
  findById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /** Obtener todas las recetas */
  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** Crear receta */
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  /** Actualizar receta */
  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  /** Eliminar receta */
  remove(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);

  }
findOne(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }


}
