// src/app/services/receta-ingrediente.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';   // 👈 importa env

interface CrearRelacion {
  id_receta: number;
  id_ingrediente: number;
  cantidad_usada: number;
}

@Injectable({ providedIn: 'root' })
export class RecetaIngredienteService {

  /* URL base dinámica */
  private api = `${environment.apiUrl}/recetas-ingredientes`;

  constructor(private http: HttpClient) {}

  /* ---------- CRUD relación receta-ingrediente ---------- */

  /** Crear relación entre receta e ingrediente */
  create(data: CrearRelacion): Observable<any> {
    return this.http.post<any>(this.api, data);
  }

  /** Eliminar un ingrediente de una receta */
  remove(id_receta: number, id_ingrediente: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id_receta}/${id_ingrediente}`);
  }

  /** Actualizar cantidad usada */
  updateCantidad(id_receta: number, id_ingrediente: number, cantidad: number): Observable<any> {
    const url =
      `${this.api}/actualizar-cantidad?` +
      `id_receta=${id_receta}&id_ingrediente=${id_ingrediente}&nueva=${cantidad}`;
    return this.http.patch<any>(url, {});
  }

  /** Obtener todos los ingredientes de una receta */
  findByReceta(id_receta: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/receta/${id_receta}`);
  }
}
