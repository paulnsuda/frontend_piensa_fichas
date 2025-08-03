import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Compra {
  id?: number;
  descripcion: string;
  proveedorId: number;
  peso_kg: number;
  costo_total: number;
  fecha_compra: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = 'http://localhost:3000/compras';

  constructor(private http: HttpClient) {}

  getCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.apiUrl);
  }

  crearCompra(compra: Compra): Observable<Compra> {
    return this.http.post<Compra>(this.apiUrl, compra);
  }

  eliminarCompra(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
