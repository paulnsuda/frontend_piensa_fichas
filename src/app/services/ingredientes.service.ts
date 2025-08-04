// src/app/services/ingrediente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';   // 👈 importa environment

export interface Ingrediente {
  id?: number;
  nombre_ingrediente: string;
  unidad_medida: string;
  precioKg: number;
  peso: number;
  pesoKg: number;
  grupo: string;
  id_compra?: number;
}

@Injectable({ providedIn: 'root' })
export class IngredienteService {

  /* URL base dinámica (dev → localhost, prod → Render) */
  private api = `${environment.apiUrl}/ingredientes`;

  constructor(private http: HttpClient) {}

  /* === CRUD === */
  findAll(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(this.api);
  }

  create(dto: Partial<Ingrediente>): Observable<Ingrediente> {
    return this.http.post<Ingrediente>(this.api, dto);
  }

  update(id: number, dto: Partial<Ingrediente>): Observable<Ingrediente> {
    return this.http.put<Ingrediente>(`${this.api}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
