// src/app/services/compra.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';   // 👈 importa env

export interface Compra {
  id?: number;
  descripcion: string;
  proveedorId: number;
  peso_kg: number;
  costo_total: number;
  fecha_compra: string;
}

@Injectable({ providedIn: 'root' })
export class CompraService {

  /* URL dinámica según entorno */
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
