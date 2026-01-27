import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecetaService {
  /* URL base dinámica (dev → localhost, prod → Render) */
  private apiUrl = `${environment.apiUrl}/recetas`;

  constructor(private http: HttpClient) {}

  /* ---------- CRUD ---------- */

  /** Obtener todas las recetas */
  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** Obtener una receta por ID (Ficha Técnica completa) */
  findOne(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /** Crear receta */
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  /** Actualizar receta 
   * NOTA: Usamos PATCH porque el backend actualiza parcialmente 
   */
  update(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  /** Eliminar receta */
  remove(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /* ---------- FUNCIONES ESPECIALES ---------- */

  /** * 🔥 CONVERTIR EN SUBFICHA 
   * Llama al backend para transformar esta receta en un ingrediente
   */
  convertirEnIngrediente(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/convertir`, {});
  }
}