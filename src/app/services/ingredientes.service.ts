import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private api = 'http://localhost:3000/ingredientes';

  constructor(private http: HttpClient) {}

  // Usado en cargarIngredientesDisponibles()
  findAll(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(this.api);
  }

  // Opcional si vas a crear desde el frontend
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
