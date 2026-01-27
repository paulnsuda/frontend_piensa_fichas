import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecetaService } from '../../services/recetas.service';

@Component({
  selector: 'app-ver-ficha',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ver-ficha.component.html',
  styleUrls: ['./ver-ficha.component.css']
})
export class VerFichaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recetasService = inject(RecetaService);

  receta: any = null;
  cargando = true;

  // KPIs Financieros
  costoTotal = 0;
  costoPorcion = 0;
  precioVentaSugerido = 0;
  
  // KPIs de Peso (Merma Cocción)
  pesoTotalIngredientes = 0; // Crudo (Suma de inputs)
  pesoFinalPlato = 0;        // Cocido (Porciones * Tamaño)
  mermaCoccionPorcentaje = 0;

  // Variable editable para simulación (Food Cost)
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
        // Si la receta ya tiene rentabilidad guardada, la usamos
        if (data.rentabilidad) this.foodCostPorcentaje = Number(data.rentabilidad);
        
        this.calcularFicha();
        this.cargando = false;
      },
      error: (e) => {
        console.error(e);
        this.cargando = false;
      }
    });
  }

  calcularFicha() {
    if (!this.receta || !this.receta.recetasIngredientes) return;

    let sumaCostos = 0;
    let sumaPesoIngredientes = 0;

    // 1. ITERAR INGREDIENTES Y SUMAR COSTOS
    this.receta.recetasIngredientes.forEach((item: any) => {
      // Precio: Usamos costo histórico si existe (receta antigua), 
      // si no, usamos el precio real actual del ingrediente (que incluye merma limpieza)
      const precioCalculo = Number(item.costo_historico) > 0 
        ? Number(item.costo_historico) 
        : Number(item.ingrediente?.precio_real || 0);

      const cantidad = Number(item.cantidad_usada);
      const costoItem = cantidad * precioCalculo;

      // Acumuladores
      sumaCostos += costoItem;
      sumaPesoIngredientes += cantidad; // Asumimos todo normalizado en KG/LT

      // Guardamos valores en el objeto item para mostrarlos en la tabla HTML
      item.precio_calculo_display = precioCalculo;
      item.costo_total_display = costoItem;
      // Factor de corrección (Merma Limpieza) para mostrar en tabla
      item.factor_merma_display = item.ingrediente?.peso_unitario || 1;
    });

    this.costoTotal = sumaCostos;
    this.pesoTotalIngredientes = sumaPesoIngredientes;

    // 2. CALCULAR MERMA DE COCCIÓN (CRUDO VS COCIDO)
    const numPorciones = Number(this.receta.numPorciones) || 1;
    let tamPorcion = Number(this.receta.tamanoPorcion) || 0; 
    
    // 👇👇👇 SOLUCIÓN 2: PROTECCIÓN INTELIGENTE ANTI-FALLOS 👇👇👇
    // Si el valor es mayor a 5, el sistema asume que el usuario ingresó GRAMOS (ej: 500) 
    // en lugar de KILOS. Lo dividimos para 1000 automáticamente.
    if (tamPorcion > 5) { 
       tamPorcion = tamPorcion / 1000;
    }
    // 👆👆👆 FIN DE LA CORRECCIÓN 👆👆👆

    this.pesoFinalPlato = numPorciones * tamPorcion;

    if (this.pesoTotalIngredientes > 0) {
      // Fórmula: ( (PesoCrudo - PesoCocido) / PesoCrudo ) * 100
      // Diferencia Positiva = El plato perdió peso (se redujo/evaporó)
      const diferencia = this.pesoTotalIngredientes - this.pesoFinalPlato;
      this.mermaCoccionPorcentaje = (diferencia / this.pesoTotalIngredientes) * 100;
    }

    // 3. KPI FINANCIEROS (RENTABILIDAD)
    this.costoPorcion = this.costoTotal / numPorciones;
    this.actualizarRentabilidad();
  }

  actualizarRentabilidad() {
    if (this.foodCostPorcentaje > 0 && this.costoPorcion > 0) {
      // Fórmula estándar de gastronomía: Precio Venta = Costo / %FoodCost
      this.precioVentaSugerido = this.costoPorcion / (this.foodCostPorcentaje / 100);
    } else {
      this.precioVentaSugerido = 0;
    }
  }

  // 👇 ACCIÓN PARA CONVERTIR EN SUBFICHA (Receta -> Ingrediente)
  convertirEnSubficha() {
    if (!confirm('¿Deseas guardar esta receta como una preparación (ingrediente) para usarla en otros platos?')) return;

    this.recetasService.convertirEnIngrediente(this.receta.id).subscribe({
      next: () => {
        alert('¡Éxito! Ahora puedes buscar esta receta en el listado de ingredientes.');
        this.router.navigate(['/ingredientes']);
      },
      error: (e) => alert('Error al convertir: ' + e.message)
    });
  }
  
  imprimir() {
    window.print();
  }
}