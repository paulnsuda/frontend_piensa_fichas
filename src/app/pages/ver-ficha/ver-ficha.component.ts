import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 👈 IMPORTANTE: Para editar el porcentaje
import { RecetaService } from '../../services/recetas.service';

@Component({
  selector: 'app-ver-ficha',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // 👈 Agregado aquí también
  templateUrl: './ver-ficha.component.html',
  styleUrls: ['./ver-ficha.component.css']
})
export class VerFichaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recetasService = inject(RecetaService);

  receta: any = null;
  cargando = true;

  // Variables para cálculos
  costoTotal = 0;
  costoPorcion = 0;
  precioVentaSugerido = 0;
  
  // Variable editable para el simulador
  foodCostPorcentaje: number = 30; 

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarReceta(Number(id));
    }
  }

  cargarReceta(id: number) {
    this.recetasService.findOne(id).subscribe({
      next: (data) => {
        this.receta = data;
        this.calcularCostos(); // Calcula costos y luego rentabilidad
        this.cargando = false;
      },
      error: (e) => {
        console.error(e);
        this.cargando = false;
      }
    });
  }

  // 1. CALCULA LOS COSTOS REALES (Materia Prima)
  calcularCostos() {
    if (!this.receta || !this.receta.recetasIngredientes) return;

    this.costoTotal = this.receta.recetasIngredientes.reduce((acc: number, item: any) => {
      
      // Lógica de Snapshot (Histórico vs Actual)
      const precioUnitarioReal = Number(item.costo_historico) > 0 
        ? Number(item.costo_historico) 
        : Number(item.ingrediente?.precioKg || 0);

      // Guardamos para mostrar en la tabla
      item.precio_calculo_display = precioUnitarioReal; 

      const costoItem = (Number(item.cantidad_usada) * precioUnitarioReal);
      return acc + costoItem;
    }, 0);

    // Costo por Porción
    const pax = Number(this.receta.num_porciones) || 1;
    this.costoPorcion = this.costoTotal / pax;

    // AL FINAL: Llamamos a la rentabilidad para calcular el precio de venta inicial
    this.actualizarRentabilidad();
  }

  // 2. SIMULADOR DE RENTABILIDAD (Se llama al inicio y al editar el input)
  actualizarRentabilidad() {
    if (this.foodCostPorcentaje > 0 && this.costoPorcion > 0) {
      // Fórmula: Costo Porción / (Porcentaje / 100)
      this.precioVentaSugerido = this.costoPorcion / (this.foodCostPorcentaje / 100);
    } else {
      this.precioVentaSugerido = 0;
    }
  }
  
  imprimir() {
    window.print();
  }
}