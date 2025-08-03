import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecetaIngredienteService } from '../../../services/receta-ingrediente.service';
import { RecetaService } from '../../../services/recetas.service';
@Component({
  standalone: true,
  selector: 'app-consultar-receta',
  imports: [CommonModule, FormsModule],
  templateUrl: './consultar-receta.component.html',
  styleUrls: ['./consultar-receta.component.css'],
})
export class ConsultarRecetaComponent implements OnInit {
  recetaId!: number;
  recetaNombre = '';
  costoTotal = 0;
  ingredientes: any[] = [];
  today = new Date();

  nuevoIngrediente = {
    nombre: '',
    cantidad: 0,
    unidad: '',
    costo_unitario: 0,
  };

  editandoId: string | null = null;
  ingredienteEditado: any = {};

  constructor(
    private route: ActivatedRoute,
    private recetaService: RecetaService,
    private recetaIngredienteService: RecetaIngredienteService
  ) {}

  ngOnInit(): void {
    this.recetaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarReceta();
    this.cargarIngredientes();
  }

  cargarReceta() {
    this.recetaService.getReceta(this.recetaId).subscribe({
      next: (r) => {
        this.recetaNombre = r.nombre;
        this.costoTotal = r.costo_total;
      },
      error: () => alert('Error al cargar la receta'),
    });
  }

  cargarIngredientes() {
    this.recetaIngredienteService.getPorReceta(this.recetaId).subscribe({
      next: (data) => (this.ingredientes = data),
      error: () => alert('Error al cargar ingredientes'),
    });
  }

  calcularSubtotal(i: any): number {
    return i.cantidad * i.costo_unitario;
  }

  imprimirFicha() {
    window.print();
  }

  agregarIngrediente() {
    const dto = {
      id_receta: this.recetaId,
      nombre: this.nuevoIngrediente.nombre,
      cantidad: this.nuevoIngrediente.cantidad,
      unidad: this.nuevoIngrediente.unidad,
      costo_unitario: this.nuevoIngrediente.costo_unitario,
    };

    this.recetaIngredienteService.agregar(dto).subscribe({
      next: () => {
        this.cargarIngredientes();
        this.cargarReceta();
        this.nuevoIngrediente = { nombre: '', cantidad: 0, unidad: '', costo_unitario: 0 };
      },
      error: () => alert('Error al agregar ingrediente'),
    });
  }

  eliminarIngrediente(idReceta: number, idIngrediente: number) {
    const confirmacion = confirm('¿Estás seguro de eliminar este ingrediente?');
    if (!confirmacion) return;

    this.recetaIngredienteService.eliminar(idReceta, idIngrediente).subscribe({
      next: () => {
        this.cargarIngredientes();
        this.cargarReceta();
      },
      error: () => alert('Error al eliminar el ingrediente'),
    });
  }

  empezarEdicion(i: any) {
    this.editandoId = `${i.id_receta}_${i.id_ingrediente}`;
    this.ingredienteEditado = { ...i };
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.ingredienteEditado = {};
  }

  guardarEdicion() {
    const idReceta = this.ingredienteEditado.id_receta;
    const idIngrediente = this.ingredienteEditado.id_ingrediente;

    const dto = {
      cantidad: this.ingredienteEditado.cantidad,
      costo_unitario: this.ingredienteEditado.costo_unitario,
    };

    this.recetaIngredienteService.actualizar(idReceta, idIngrediente, dto).subscribe({
      next: () => {
        this.editandoId = null;
        this.cargarIngredientes();
        this.cargarReceta();
      },
      error: () => alert('Error al guardar cambios'),
    });
  }
}
