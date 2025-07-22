import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Ingrediente {
  id?: number;
  nombre: string;
  unidad: string;
  precio: number;
}

@Injectable({ providedIn: 'root' })
export class IngredienteService {
  private apiUrl = `${environment.apiUrl}/ingredientes`; // ✅ ya usa el environment

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getIngredientes(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  addIngrediente(i: Ingrediente): Observable<Ingrediente> {
    return this.http.post<Ingrediente>(this.apiUrl, i, {
      headers: this.getHeaders()
    });
  }

  updateIngrediente(id: number, i: Ingrediente): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, i, {
      headers: this.getHeaders()
    });
  }

  deleteIngrediente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
