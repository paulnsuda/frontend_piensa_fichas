import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaz actualizada para coincidir con el Backend
export interface Compra {
  id?: number;
  nombre_presentacion: string; // Antes descripcion
  id_proveedor: number;        // Antes proveedorId
  id_ingrediente: number;      // 👈 Nuevo campo vital
  peso_kg: number;
  costo_final: number;         // Antes costo_total
  precio_compra?: number;
  unidad_compra?: string;
  rendimiento?: number;
  factor_correccion?: number;
  fecha_compra?: string;
  
  // Campos opcionales para la vista (si vienen del backend poblados)
  descripcion?: string; 
  proveedor?: any;
  ingrediente?: any;
}

@Injectable({ providedIn: 'root' })
export class CompraService {

  private apiUrl = `${environment.apiUrl}/compras`;

  constructor(private http: HttpClient) {}

  getCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.apiUrl);
  }

  crearCompra(compra: Compra): Observable<Compra> {
    return this.http.post<Compra>(this.apiUrl, compra);
  }

  eliminarCompra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}