import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IngredienteService, Ingrediente } from '../../services/ingredientes.service';

interface FilaVisual extends Ingrediente {
  editando?: boolean;
  backup?: Ingrediente;
}

@Component({
  selector: 'app-ingredientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ingredientes.component.html',
  styleUrls: ['./ingredientes.component.css'],
})
export class IngredientesComponent implements OnInit {
  ingredientes: FilaVisual[] = [];
  ingredientesFiltrados: FilaVisual[] = [];
  busqueda = '';

  nueva: Partial<Ingrediente> = {
    nombre_ingrediente: '',
    unidad_medida: 'g',
    precioKg: 0, // ✅ corregido: era `precio`
    peso: 0,
    grupo: '',
  };

  nuevoGrupo = {
    nombre: '',
    descripcion: ''
  };

  constructor(private srv: IngredienteService) {}

  ngOnInit(): void {
    this.cargar();
  }

  // 👉 Cargar ingredientes desde el backend
  cargar() {
    this.srv.getIngredientes().subscribe((data) => {
      this.ingredientes = data;
      this.filtrarIngredientes();
    });
  }

  // 👉 Agregar nuevo ingrediente
  agregar() {
    this.srv.createIngrediente(this.nueva).subscribe({
      next: (ing) => {
        this.ingredientes.push(ing);
        this.filtrarIngredientes();
        this.nueva = {
          nombre_ingrediente: '',
          unidad_medida: 'g',
          precioKg: 0,
          peso: 0,
          grupo: '',
        };
      },
      error: () => alert('Error al agregar ingrediente'),
    });
  }

  // 👉 Editar ingrediente
  editar(f: FilaVisual) {
    f.backup = { ...f };
    f.editando = true;
  }

  // 👉 Guardar cambios
  guardar(f: FilaVisual) {
    const dto = { ...f };
    delete dto.editando;
    delete dto.backup;
    this.srv.updateIngrediente(f.id!, dto).subscribe({
      next: (upd) => {
        Object.assign(f, upd);
        f.editando = false;
        this.filtrarIngredientes();
      },
      error: () => alert('Error al actualizar ingrediente'),
    });
  }

  // 👉 Cancelar edición
  cancelar(f: FilaVisual) {
    Object.assign(f, f.backup!);
    f.editando = false;
  }

  // 👉 Eliminar ingrediente
  eliminar(f: FilaVisual) {
    if (!confirm(`¿Eliminar "${f.nombre_ingrediente}"?`)) return;
    this.srv.deleteIngrediente(f.id!).subscribe({
      next: () => {
        this.ingredientes = this.ingredientes.filter((i) => i.id !== f.id);
        this.filtrarIngredientes();
      },
      error: () => alert('Error al eliminar ingrediente'),
    });
  }

  // 👉 Filtrar lista en tiempo real
  filtrarIngredientes() {
    const texto = this.busqueda.toLowerCase();
    this.ingredientesFiltrados = this.ingredientes.filter((i) =>
      i.nombre_ingrediente.toLowerCase().includes(texto) ||
      i.grupo.toLowerCase().includes(texto)
    );
  }

  // 👉 Agregar grupo (solo visual o prueba)
  agregarGrupo() {
    if (!this.nuevoGrupo.nombre.trim()) {
      alert('El nombre del grupo es obligatorio');
      return;
    }

    console.log('Grupo agregado:', this.nuevoGrupo);
    this.nuevoGrupo = {
      nombre: '',
      descripcion: ''
    };
  }
}
