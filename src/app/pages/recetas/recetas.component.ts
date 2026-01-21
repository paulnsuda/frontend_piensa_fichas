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
  
  // INYECCIÓN DE DEPENDENCIAS
  private recetaService = inject(RecetaService);
  private ingredienteService = inject(IngredienteService);
  private router = inject(Router);

  // DATOS PARA EL SELECTOR (Buscador)
  listaIngredientes: any[] = [];

  // VARIABLES TEMPORALES (Formulario pequeño de ingredientes)
  ingredienteSeleccionadoId: number | null = null;
  cantidadAgregar: number = 0;

  // 👇 VARIABLES NUEVAS PARA MEJORAR LA UX
  nombreIngredienteBusqueda: string = ''; // Lo que escribe el usuario en el buscador
  unidadSeleccionada: string = '';        // Ej: 'Kg', 'L', 'Unidad' (se llena solo)

  // ==============================================================
  // EL OBJETO PRINCIPAL (La Receta que vamos a crear)
  // ==============================================================
  nuevaReceta: any = {
    nombre_receta: '',
    tipo_plato: 'Plato Principal',
    num_porciones: 4,           // Valor por defecto
    tamano_porcion: '',
    procedimiento: '',
    costo_receta: 0,
    recetasIngredientes: []     // Array en memoria
  };

  ngOnInit(): void {
    this.cargarIngredientesDisponibles();
  }

  // Cargar lista para el desplegable/buscador
  cargarIngredientesDisponibles(): void {
    this.ingredienteService.findAll().subscribe(data => {
      this.listaIngredientes = data;
    });
  }

  // ==============================================================
  // 🔽 NUEVAS FUNCIONES PARA EL BUSCADOR INTELIGENTE 🔽
  // ==============================================================

  // 1. Detecta qué ingrediente eligió el usuario de la lista escribible
  alSeleccionarIngrediente(evento: any): void {
    const valorInput = evento.target.value;
    
    // Buscamos el ingrediente completo en la lista original por su nombre
    const encontrado = this.listaIngredientes.find(i => i.nombre_ingrediente === valorInput);

    if (encontrado) {
      this.ingredienteSeleccionadoId = encontrado.id;
      this.unidadSeleccionada = encontrado.unidad_medida; // ¡Detectamos la unidad! (Kg, L, etc.)
    } else {
      // Si escribió algo que no existe en la lista
      this.ingredienteSeleccionadoId = null;
      this.unidadSeleccionada = '';
    }
  }

  // 2. Botón para ir a crear un ingrediente nuevo rápidamente
  irACrearIngrediente(): void {
    // Abre en nueva pestaña para no perder los datos de la receta actual
    window.open('/ingredientes', '_blank'); 
  }

  // ==============================================================
  // LÓGICA DE INGREDIENTES (EN MEMORIA)
  // ==============================================================
  
  agregarIngrediente(): void {
    // 1. Validaciones
    if (!this.ingredienteSeleccionadoId) {
      alert('Por favor, selecciona un ingrediente válido de la lista.');
      return;
    }
    if (this.cantidadAgregar <= 0) {
      alert('La cantidad debe ser mayor a 0.');
      return;
    }

    // 2. Buscar datos completos del ingrediente seleccionado
    const ingEncontrado = this.listaIngredientes.find(i => i.id == this.ingredienteSeleccionadoId);

    if (ingEncontrado) {
      // 3. Agregamos al array visual
      this.nuevaReceta.recetasIngredientes.push({
        id_ingrediente: ingEncontrado.id,
        nombre: ingEncontrado.nombre_ingrediente, // Para mostrar en tabla
        unidad: ingEncontrado.unidad_medida,      // Para mostrar en tabla
        precio: ingEncontrado.precioKg,           // Para calcular costos actuales
        cantidad_usada: this.cantidadAgregar,
        subtotal: (this.cantidadAgregar * ingEncontrado.precioKg)
      });

      // 4. Actualizamos el costo total
      this.calcularTotal();

      // 5. LIMPIEZA COMPLETA
      this.ingredienteSeleccionadoId = null;
      this.cantidadAgregar = 0;
      this.nombreIngredienteBusqueda = ''; // Limpiamos el buscador visual
      this.unidadSeleccionada = '';        // Limpiamos la unidad visual
    }
  }

  eliminarIngrediente(index: number): void {
    this.nuevaReceta.recetasIngredientes.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.nuevaReceta.costo_receta = this.nuevaReceta.recetasIngredientes.reduce(
      (acc: number, item: any) => acc + item.subtotal, 0
    );
  }

  // ==============================================================
  // GUARDAR TODO EN BASE DE DATOS (CON PRECIO HISTÓRICO ✅)
  // ==============================================================
  guardarReceta(): void {
    if (!this.nuevaReceta.nombre_receta) {
      alert('El nombre de la receta es obligatorio.');
      return;
    }
    if (this.nuevaReceta.recetasIngredientes.length === 0) {
      alert('Debes agregar al menos un ingrediente.');
      return;
    }

    // 2. LIMPIEZA DE DATOS (Mapeo para el Backend)
    const datosParaBackend = {
      nombre_receta: this.nuevaReceta.nombre_receta,
      tipo_plato: this.nuevaReceta.tipo_plato,
      num_porciones: Number(this.nuevaReceta.num_porciones),
      tamano_porcion: this.nuevaReceta.tamano_porcion,
      procedimiento: this.nuevaReceta.procedimiento,
      costo_receta: Number(this.nuevaReceta.costo_receta),
      
      // Enviamos el objeto ingrediente como le gusta a TypeORM
      recetasIngredientes: this.nuevaReceta.recetasIngredientes.map((item: any) => ({
        cantidad_usada: Number(item.cantidad_usada),
        ingrediente: { id: Number(item.id_ingrediente) },
        
        // 👇 ESTO ES LO NUEVO: Guardamos el precio del momento (Snapshot)
        costo_historico: Number(item.precio) 
      }))
    };

    console.log('Enviando datos limpios:', datosParaBackend);

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