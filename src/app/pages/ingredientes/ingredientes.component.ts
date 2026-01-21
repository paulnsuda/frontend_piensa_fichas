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
    precioKg: 0,
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

  // 👉 1. HELPER PARA LIMPIAR NÚMEROS (El secreto para evitar error 400)
  // Convierte "2,5" en 2.5 y asegura que sea un número real
  private limpiarNumero(valor: any): number {
    if (!valor) return 0;
    if (typeof valor === 'string') {
      // Reemplaza coma por punto y convierte
      return parseFloat(valor.replace(',', '.'));
    }
    return Number(valor);
  }

  cargar() {
    this.srv.findAll().subscribe((data: Ingrediente[]) => {
      this.ingredientes = data;
      this.filtrarIngredientes();
    });
  }

  agregar() {
    // Limpiamos antes de enviar
    const datosLimpios = {
      ...this.nueva,
      precioKg: this.limpiarNumero(this.nueva.precioKg),
      peso: this.limpiarNumero(this.nueva.peso)
    };

    this.srv.create(datosLimpios).subscribe({
      next: (ing: Ingrediente) => {
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

  editar(f: FilaVisual) {
    f.backup = { ...f };
    f.editando = true;
  }

  // 👉 2. FUNCIÓN GUARDAR CORREGIDA (Aquí estaba el error)
  guardar(f: FilaVisual) {
    
    // A) CREAMOS UN OBJETO LIMPIO
    // No usamos { ...f } porque copia el ID y deletedAt.
    // Solo copiamos lo que el Backend permite editar.
    const dtoLimpios = {
      nombre_ingrediente: f.nombre_ingrediente,
      unidad_medida: f.unidad_medida,
      grupo: f.grupo,
      // B) Aseguramos que los números sean correctos (sin comas)
      precioKg: this.limpiarNumero(f.precioKg),
      peso: this.limpiarNumero(f.peso)
    };

    // C) ENVIAMOS SOLO LOS DATOS LIMPIOS
    this.srv.update(f.id!, dtoLimpios).subscribe({
      next: (upd: Ingrediente) => {
        Object.assign(f, upd); // Actualizamos la vista con la respuesta real
        f.editando = false;
        this.filtrarIngredientes();
        alert('✅ Actualizado correctamente');
      },
      error: (err) => {
        console.error(err);
        // Mostramos el mensaje exacto del servidor para entender qué pasa
        const mensaje = err.error?.message || 'Error desconocido';
        alert('❌ Error al actualizar: ' + (Array.isArray(mensaje) ? mensaje.join(', ') : mensaje));
      },
    });
  }

  cancelar(f: FilaVisual) {
    Object.assign(f, f.backup!);
    f.editando = false;
  }

  eliminar(f: FilaVisual) {
    if (!confirm(`¿Eliminar "${f.nombre_ingrediente}"?`)) return;
    this.srv.delete(f.id!).subscribe({
      next: () => {
        this.ingredientes = this.ingredientes.filter((i) => i.id !== f.id);
        this.filtrarIngredientes();
      },
      error: () => alert('Error al eliminar ingrediente'),
    });
  }

  filtrarIngredientes() {
    const texto = this.busqueda.toLowerCase();
    this.ingredientesFiltrados = this.ingredientes.filter((i) =>
      i.nombre_ingrediente.toLowerCase().includes(texto) ||
      i.grupo.toLowerCase().includes(texto)
    );
  }

  agregarGrupo() {
    if (!this.nuevoGrupo.nombre.trim()) {
      alert('El nombre del grupo es obligatorio');
      return;
    }
    console.log('Grupo agregado:', this.nuevoGrupo);
    this.nuevoGrupo = { nombre: '', descripcion: '' };
  }
}