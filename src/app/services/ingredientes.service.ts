import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Ingrediente {
  id?: number;
  nombre_ingrediente: string;
  unidad_medida: string;
  grupo?: string;

  // PRECIO
  precioKg: number;       // Precio de compra (Bruto)

  // 👇 CAMPOS DE TRANSFORMACIÓN (TEST DE MERMA) - ¡LOS QUE FALTABAN!
  peso_bruto?: number;       // Peso inicial (ej: 3.5)
  peso_neto?: number;        // Peso útil (ej: 1.2)
  peso_desperdicio?: number; // Basura (ej: 0.3)
  peso_subproducto?: number; // Huesos/Recortes (ej: 2.0)

  // CALCULADOS
  rendimiento?: number;   // % Rendimiento
  peso_unitario?: number; // Factor de corrección
  precio_real?: number;   // Costo Real ya calculado

  // Identificador de Subficha (para el futuro paso)
  es_preparacion?: boolean;

  deletedAt?: Date;
}

@Injectable({ providedIn: 'root' })
export class IngredienteService {
  private apiUrl = `${environment.apiUrl}/ingredientes`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(this.apiUrl);
  }

  create(data: any): Observable<Ingrediente> {
    return this.http.post<Ingrediente>(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<Ingrediente> {
    return this.http.patch<Ingrediente>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}