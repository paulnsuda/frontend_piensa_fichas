// src/app/pages/recetas/recetas.component.ts
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute }         from '@angular/router';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';

import { RecetaService }            from '../../services/recetas.service';
import { IngredienteService }       from '../../services/ingredientes.service';
import { RecetaIngredienteService } from '../../services/receta-ingrediente.service';

@Component({
  selector   : 'app-recetas',
  standalone : true,
  imports    : [CommonModule, FormsModule],
  templateUrl: './recetas.component.html',
  styleUrls  : ['./recetas.component.css'],
})
export class RecetasComponent implements OnInit {

  /* ---------- encabezado ---------- */
  recetaId!: number;
  recetaNombre = '';
  costoTotal   = 0;
  today        = new Date();

  /* ---------- datos ---------- */
  ingredientes:           any[] = [];
  ingredientesDisponibles:any[] = [];

  /* ---------- formulario nuevo ---------- */
  nuevoIngrediente = {
    ingredienteId : null as number | null,
    cantidad      : 0,
    unidad        : '',
    costo_unitario: 0,
  };

  /* ---------- edición ---------- */
  editandoId:        number | null = null;
  ingredienteEditado:any           = {};

  /* ---------- inyección ---------- */
  constructor(
    private route: ActivatedRoute,
    private recetaService:            RecetaService,
    private ingredienteService:       IngredienteService,
    private recetaIngredienteService: RecetaIngredienteService,
  ) {}

  /* ===================== ciclo de vida ===================== */
  ngOnInit(): void {

    /* ── PASO 3: valida que venga un parámetro “id” ── */
    const rawId = this.route.snapshot.paramMap.get('id');
    if (!rawId) {                     // si entran sin /:id
      return;                         // (opcional: redirigir al listado)
    }

    this.recetaId = +rawId;
    if (isNaN(this.recetaId) || this.recetaId <= 0) { return; }

    /* ── ya tenemos id válido ── */
    this.cargarReceta();
    this.cargarIngredientesDisponibles();
  }

  /* ======================= cargas ======================= */
  cargarReceta(): void {
    this.recetaService.findById(this.recetaId).subscribe(receta => {
      this.recetaNombre = receta.nombreReceta;
    });

    this.recetaIngredienteService.findByReceta(this.recetaId)
      .subscribe((rows: any[]) => {
        this.ingredientes = rows.map(r => ({
          id_ingrediente : r.ingrediente.id,
          nombre         : r.ingrediente.nombre_ingrediente,
          unidad         : r.ingrediente.unidad_medida,
          cantidad       : +r.cantidad_usada,
          costo_unitario : +r.costo_ingrediente,
        }));
        this.actualizarCostoTotal();
      });
  }

  cargarIngredientesDisponibles(): void {
    this.ingredienteService.findAll().subscribe(data => {
      this.ingredientesDisponibles = data;
    });
  }

  /* =================== formulario =================== */
  onIngredienteChange(): void {
    const ing = this.ingredientesDisponibles
                   .find(i => i.id === this.nuevoIngrediente.ingredienteId);
    if (ing) {
      this.nuevoIngrediente.unidad         = ing.unidad_medida;
      this.nuevoIngrediente.costo_unitario = +ing.precioKg;
    }
  }

  agregarIngrediente(): void {
    if (!this.nuevoIngrediente.ingredienteId || this.nuevoIngrediente.cantidad <= 0) { return; }

    const dto = {
      id_receta     : this.recetaId,
      id_ingrediente: this.nuevoIngrediente.ingredienteId,
      cantidad_usada: this.nuevoIngrediente.cantidad,
    };

    this.recetaIngredienteService.create(dto).subscribe(() => {
      this.nuevoIngrediente = { ingredienteId: null, cantidad: 0, unidad: '', costo_unitario: 0 };
      this.cargarReceta();
    });
  }

  /* =================== acciones fila =================== */
  editarIngrediente(ing: any): void {
    this.editandoId        = ing.id_ingrediente;
    this.ingredienteEditado = { cantidad_usada: ing.cantidad };
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.ingredienteEditado = {};
  }

  guardarEdicion(ing: any): void {
    const nueva = +this.ingredienteEditado.cantidad_usada;
    if (nueva <= 0) { return; }

    this.recetaIngredienteService
      .updateCantidad(this.recetaId, ing.id_ingrediente, nueva)
      .subscribe(() => {
        this.cancelarEdicion();
        this.cargarReceta();
      });
  }

  eliminarIngrediente(id_ingrediente: number): void {
    this.recetaIngredienteService
      .remove(this.recetaId, id_ingrediente)
      .subscribe(() => this.cargarReceta());
  }

  /* =================== utilidades =================== */
  actualizarCostoTotal(): void {
    this.costoTotal = this.ingredientes
      .reduce((s, i) => s + (+i.cantidad * +i.costo_unitario), 0);
  }

  imprimir(): void { window.print(); }
}
