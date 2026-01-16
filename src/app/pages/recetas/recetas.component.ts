// src/app/pages/recetas/recetas.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// TUS SERVICIOS
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
  
  // INYECCIÓN DE DEPENDENCIAS (Moderna)
  private recetaService = inject(RecetaService);
  private ingredienteService = inject(IngredienteService);
  private router = inject(Router);

  // DATOS PARA EL SELECTOR (Buscador)
  listaIngredientes: any[] = [];

  // VARIABLES TEMPORALES (Formulario pequeño de ingredientes)
  ingredienteSeleccionadoId: number | null = null;
  cantidadAgregar: number = 0;

  // ==============================================================
  // EL OBJETO PRINCIPAL (La Receta que vamos a crear)
  // ==============================================================
  nuevaReceta: any = {
    nombre_receta: '',
    tipo_plato: 'Plato Principal',
    num_porciones: 4,          // Valor por defecto
    tamano_porcion: '',
    procedimiento: '',
    costo_receta: 0,
    recetasIngredientes: []    // Aquí guardamos los ingredientes en memoria antes de guardar
  };

  ngOnInit(): void {
    // Solo cargamos la lista de ingredientes para llenar el "Select"
    this.cargarIngredientesDisponibles();
  }

  // Cargar lista para el desplegable
  cargarIngredientesDisponibles(): void {
    this.ingredienteService.findAll().subscribe(data => {
      this.listaIngredientes = data;
    });
  }

  // ==============================================================
  // LÓGICA DE INGREDIENTES (EN MEMORIA)
  // ==============================================================
  
  agregarIngrediente(): void {
    // 1. Validaciones
    if (!this.ingredienteSeleccionadoId) {
      alert('Por favor, selecciona un ingrediente.');
      return;
    }
    if (this.cantidadAgregar <= 0) {
      alert('La cantidad debe ser mayor a 0.');
      return;
    }

    // 2. Buscar datos completos del ingrediente seleccionado
    const ingEncontrado = this.listaIngredientes.find(i => i.id == this.ingredienteSeleccionadoId);

    if (ingEncontrado) {
      // 3. Agregamos al array "recetasIngredientes" de nuestra nuevaReceta
      // NO guardamos en base de datos todavía, solo en la lista visual.
      this.nuevaReceta.recetasIngredientes.push({
        id_ingrediente: ingEncontrado.id,
        nombre: ingEncontrado.nombre_ingrediente, // Para mostrar en tabla
        unidad: ingEncontrado.unidad_medida,      // Para mostrar en tabla
        precio: ingEncontrado.precioKg,           // Para calcular costos
        cantidad_usada: this.cantidadAgregar,
        subtotal: (this.cantidadAgregar * ingEncontrado.precioKg)
      });

      // 4. Actualizamos el costo total de la receta
      this.calcularTotal();

      // 5. Limpiar campos del formulario pequeño
      this.ingredienteSeleccionadoId = null;
      this.cantidadAgregar = 0;
    }
  }

  eliminarIngrediente(index: number): void {
    // Borramos del array temporal
    this.nuevaReceta.recetasIngredientes.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal(): void {
    // Suma todos los subtotales
    this.nuevaReceta.costo_receta = this.nuevaReceta.recetasIngredientes.reduce(
      (acc: number, item: any) => acc + item.subtotal, 0
    );
  }

  // ==============================================================
  // GUARDAR TODO EN BASE DE DATOS
  // ==============================================================
 guardarReceta(): void {
    // 1. Validaciones básicas
    if (!this.nuevaReceta.nombre_receta) {
      alert('El nombre de la receta es obligatorio.');
      return;
    }
    if (this.nuevaReceta.recetasIngredientes.length === 0) {
      alert('Debes agregar al menos un ingrediente.');
      return;
    }

    // 2. LIMPIEZA DE DATOS (La Magia) ✨
    // Creamos un objeto limpio para enviar SOLO lo que el backend necesita.
  const datosParaBackend = {
      nombre_receta: this.nuevaReceta.nombre_receta,
      tipo_plato: this.nuevaReceta.tipo_plato,
      num_porciones: Number(this.nuevaReceta.num_porciones),
      tamano_porcion: this.nuevaReceta.tamano_porcion,
      procedimiento: this.nuevaReceta.procedimiento,
      costo_receta: Number(this.nuevaReceta.costo_receta),
      
      // 👇 AQUÍ ESTÁ EL CAMBIO CLAVE PARA ARREGLARLO:
      // En lugar de enviar 'id_ingrediente', enviamos el objeto 'ingrediente' con su ID inside.
      recetasIngredientes: this.nuevaReceta.recetasIngredientes.map((item: any) => ({
        cantidad_usada: Number(item.cantidad_usada),
        ingrediente: { id: Number(item.id_ingrediente) } // 👈 TypeORM amará esto
      }))
    };

    console.log('Enviando datos limpios:', datosParaBackend);

    // 3. Enviamos los datos limpios
    this.recetaService.create(datosParaBackend).subscribe({
      next: (res) => {
        alert('✅ Receta creada con éxito');
        this.router.navigate(['/listar-recetas']);
      },
      error: (err) => {
        console.error('Error creando receta:', err);
        // Mostrar mensaje específico del backend si existe
        const mensaje = err.error?.message || 'Error desconocido';
        alert('Error al guardar: ' + (Array.isArray(mensaje) ? mensaje.join(', ') : mensaje));
      }
    });
  }
}