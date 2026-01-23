import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { RecetaService } from '../../services/recetas.service';
import { IngredienteService } from '../../services/ingredientes.service';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.css'],
})
export class RecetasComponent implements OnInit {
  
  private recetaService = inject(RecetaService);
  private ingredienteService = inject(IngredienteService);
  private router = inject(Router);

  listaIngredientes: any[] = [];

  ingredienteSeleccionadoId: number | null = null;
  cantidadAgregar: number = 0;

  // Variables de UX
  nombreIngredienteBusqueda: string = ''; 
  unidadSeleccionada: string = '';        
  costoRealUnitario: number = 0; 

  // Objeto de la Receta (Con Rentabilidad y Precio Venta)
  nuevaReceta: any = {
    nombre_receta: '',
    tipo_plato: 'Plato Principal',
    num_porciones: 4,
    tamano_porcion: '',
    procedimiento: '',
    
    costo_receta: 0,
    
    // 👇 NUEVO: Valores por defecto para finanzas
    rentabilidad: 30, // 30% es el estándar de la industria
    precio_venta: 0,
    
    recetasIngredientes: []
  };

  ngOnInit(): void {
    this.cargarIngredientesDisponibles();
  }

  cargarIngredientesDisponibles(): void {
    this.ingredienteService.findAll().subscribe(data => {
      this.listaIngredientes = data;
    });
  }

  // BUSCADOR INTELIGENTE
  alSeleccionarIngrediente(evento: any): void {
    const valorInput = evento.target.value;
    const encontrado = this.listaIngredientes.find(i => i.nombre_ingrediente === valorInput);

    if (encontrado) {
      this.ingredienteSeleccionadoId = encontrado.id;
      this.unidadSeleccionada = encontrado.unidad_medida;
      
      // Detectamos el precio real (con merma)
      this.costoRealUnitario = encontrado.precio_real || encontrado.precioKg;
    } else {
      this.ingredienteSeleccionadoId = null;
      this.unidadSeleccionada = '';
      this.costoRealUnitario = 0;
    }
  }

  irACrearIngrediente(): void {
    window.open('/ingredientes', '_blank'); 
  }

  // AGREGAR A LA RECETA
  agregarIngrediente(): void {
    if (!this.ingredienteSeleccionadoId) {
      alert('Por favor, selecciona un ingrediente válido de la lista.');
      return;
    }
    if (this.cantidadAgregar <= 0) {
      alert('La cantidad debe ser mayor a 0.');
      return;
    }

    const ingEncontrado = this.listaIngredientes.find(i => i.id == this.ingredienteSeleccionadoId);

    if (ingEncontrado) {
      const precioAUsar = ingEncontrado.precio_real || ingEncontrado.precioKg;

      this.nuevaReceta.recetasIngredientes.push({
        id_ingrediente: ingEncontrado.id,
        nombre: ingEncontrado.nombre_ingrediente, 
        unidad: ingEncontrado.unidad_medida,      
        precio: precioAUsar,           
        cantidad_usada: this.cantidadAgregar,
        subtotal: (this.cantidadAgregar * precioAUsar)
      });

      this.calcularTotal();

      // Limpieza del formulario de ingrediente
      this.ingredienteSeleccionadoId = null;
      this.cantidadAgregar = 0;
      this.nombreIngredienteBusqueda = ''; 
      this.unidadSeleccionada = '';       
      this.costoRealUnitario = 0;
    }
  }

  eliminarIngrediente(index: number): void {
    this.nuevaReceta.recetasIngredientes.splice(index, 1);
    this.calcularTotal();
  }

  // 👇 LÓGICA FINANCIERA ACTUALIZADA
  calcularTotal(): void {
    // 1. Sumar el costo de producción (Ingredientes)
    this.nuevaReceta.costo_receta = this.nuevaReceta.recetasIngredientes.reduce(
      (acc: number, item: any) => acc + item.subtotal, 0
    );

    // 2. Calcular Precio de Venta en base a la Rentabilidad
    // Fórmula Gastronómica: Precio = Costo / (1 - %Rentabilidad)
    const margen = this.nuevaReceta.rentabilidad || 0;
    
    if (margen >= 100) {
      this.nuevaReceta.precio_venta = 0; // Evitar división por cero o márgenes imposibles
    } else {
      const factor = 1 - (margen / 100);
      this.nuevaReceta.precio_venta = this.nuevaReceta.costo_receta / factor;
    }
  }

  guardarReceta(): void {
    if (!this.nuevaReceta.nombre_receta) {
      alert('El nombre de la receta es obligatorio.');
      return;
    }
    if (this.nuevaReceta.recetasIngredientes.length === 0) {
      alert('Debes agregar al menos un ingrediente.');
      return;
    }

    const datosParaBackend = {
      nombre_receta: this.nuevaReceta.nombre_receta,
      tipo_plato: this.nuevaReceta.tipo_plato,
      num_porciones: Number(this.nuevaReceta.num_porciones),
      tamano_porcion: this.nuevaReceta.tamano_porcion,
      procedimiento: this.nuevaReceta.procedimiento,
      costo_receta: Number(this.nuevaReceta.costo_receta),
      
      // 👇 ENVIAMOS LOS DATOS FINANCIEROS
      rentabilidad: Number(this.nuevaReceta.rentabilidad),
      precio_venta: Number(this.nuevaReceta.precio_venta),

      recetasIngredientes: this.nuevaReceta.recetasIngredientes.map((item: any) => ({
        cantidad_usada: Number(item.cantidad_usada),
        ingrediente: { id: Number(item.id_ingrediente) },
        costo_historico: Number(item.precio) 
      }))
    };

    console.log('Guardando Ficha Técnica Completa:', datosParaBackend);

    this.recetaService.create(datosParaBackend).subscribe({
      next: (res) => {
        alert('✅ Receta creada con éxito');
        this.router.navigate(['/listar-recetas']);
      },
      error: (err) => {
        console.error('Error creando receta:', err);
        const mensaje = err.error?.message || 'Error desconocido';
        alert('Error al guardar: ' + (Array.isArray(mensaje) ? mensaje.join(', ') : mensaje));
      }
    });
  }
}