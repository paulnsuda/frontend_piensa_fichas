import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Usamos la URL del environment
  private apiUrl = `${environment.apiUrl}/dashboard`;

  // 👇 CAMBIO CLAVE: Usamos constructor en lugar de inject()
  // Esto elimina el error de "record.factory"
  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}