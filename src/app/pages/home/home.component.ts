import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 👈 Importante para los enlaces
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], // 👈 Agregamos RouterModule aquí
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  
  // Inicializamos los datos
  stats: any = {
    totalRecetas: 0,
    totalIngredientes: 0,
    valorInventario: 0,
    ultimasCompras: [],
    fechaActual: new Date() // 👈 Agregamos la fecha para el saludo
  };

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        // Mezclamos los datos del backend con la fecha local
        this.stats = { 
          ...data, 
          fechaActual: new Date() 
        };
      },
      error: (err) => console.error('Error cargando dashboard:', err)
    });
  }
}