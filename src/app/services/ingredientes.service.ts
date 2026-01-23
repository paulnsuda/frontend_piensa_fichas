import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Ingrediente {
  id?: number;
  nombre_ingrediente: string;
  unidad_medida: string;
  
  // 👇 CAMPOS NUEVOS QUE FALTABAN
  peso: number;           // Cantidad comprada
  pesoKg?: number;        // Stock calculado (El que daba error)
  peso_unitario?: number; // Peso de la unidad
  precioKg: number;       // Precio de compra
  
  rendimiento?: number;   // Merma
  precio_real?: number;   // Calculado
  
  grupo?: string;
  deletedAt?: Date;
}

@Injectable({ providedIn: 'root' })
export class IngredienteService {
  // Asegúrate de que apunte a 'ingredientes' (plural)
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