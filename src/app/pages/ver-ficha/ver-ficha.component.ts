import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecetaService } from '../../services/recetas.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-ver-ficha',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-ficha.component.html',
  styleUrls: ['./ver-ficha.component.css']
})
export class VerFichaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recetasService = inject(RecetaService);

  receta: any = null;
  cargando = true;

  // Variables para cálculos financieros de Alta Cocina
  costoTotal = 0;
  costoPorcion = 0;
  precioVentaSugerido = 0;
  foodCostPorcentaje = 30; // Estándar de la industria (30%)

  ngOnInit() {
    // Obtenemos el ID de la URL (ej: recetas/1 -> id=1)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarReceta(Number(id));
    }
  }

  cargarReceta(id: number) {
    // Nota: Asumimos que tu servicio tiene un método findOne. Si no, avísame.
    this.recetasService.findOne(id).subscribe({
      next: (data) => {
        this.receta = data;
        this.calcularCostos();
        this.cargando = false;
      },
      error: (e) => {
        console.error(e);
        this.cargando = false;
      }
    });
  }

  calcularCostos() {
    if (!this.receta || !this.receta.recetasIngredientes) return;

    // 1. Calcular Costo Total sumando ingrediente por ingrediente
    this.costoTotal = this.receta.recetasIngredientes.reduce((acc: number, item: any) => {
      // Precio del ingrediente * Cantidad usada
      const costoItem = (item.cantidad_usada * (item.ingrediente.precioKg || 0)); 
      return acc + costoItem;
    }, 0);

    // 2. Costo por Porción (Costo Total / Número de Pax)
    const pax = this.receta.num_porciones || 1;
    this.costoPorcion = this.costoTotal / pax;

    // 3. Precio de Venta Sugerido (Basado en el 30% de Food Cost)
    // Fórmula: Costo Porción / 0.30
    if (this.foodCostPorcentaje > 0) {
      this.precioVentaSugerido = this.costoPorcion / (this.foodCostPorcentaje / 100);
    }
  }
  
  // Función para imprimir la hoja
  imprimir() {
    window.print();
  }
}