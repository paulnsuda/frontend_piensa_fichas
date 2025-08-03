// frontend/src/app/services/ingrediente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ingrediente {
  id?: number;
  nombre_ingrediente: string;
  unidad_medida: string;
  precioKg: number; // ✅ nombre corregido
  peso: number;
  pesoKg: number;
  grupo: string;
  id_compra?: number;
}

@Injectable({ providedIn: 'root' })
export class IngredienteService {
  private api = 'http://localhost:3000/ingredientes';

  constructor(private http: HttpClient) {}

  getIngredientes(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(this.api);
  }

  createIngrediente(dto: Partial<Ingrediente>): Observable<Ingrediente> {
    return this.http.post<Ingrediente>(this.api, dto);
  }

  updateIngrediente(id: number, dto: Partial<Ingrediente>): Observable<Ingrediente> {
    return this.http.put<Ingrediente>(`${this.api}/${id}`, dto);
  }

  deleteIngrediente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
