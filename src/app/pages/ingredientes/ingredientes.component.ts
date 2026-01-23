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
    unidad_medida: 'kg',
    precioKg: 0,
    peso: 0,
    grupo: '',
    rendimiento: 100,
    peso_unitario: 1
  };

  nuevoGrupo = {
    nombre: '',
    descripcion: ''
  };

  constructor(private srv: IngredienteService) {}

  ngOnInit(): void {
    this.cargar();
  }

  private limpiarNumero(valor: any): number {
    if (!valor && valor !== 0) return 0;
    if (typeof valor === 'string') {
      return parseFloat(valor.replace(',', '.'));
    }
    return Number(valor);
  }

  calcularPrecioRealPreview(): number {
    const precio = this.limpiarNumero(this.nueva.precioKg);
    const rendimiento = this.limpiarNumero(this.nueva.rendimiento);
    if (rendimiento <= 0) return 0;
    return precio / (rendimiento / 100);
  }

  cargar() {
    this.srv.findAll().subscribe((data: Ingrediente[]) => {
      this.ingredientes = data;
      this.filtrarIngredientes();
    });
  }

  agregar() {
    if (!this.nueva.nombre_ingrediente) {
      alert('El nombre es obligatorio');
      return;
    }

    const datosLimpios = {
      ...this.nueva,
      precioKg: this.limpiarNumero(this.nueva.precioKg),
      peso: this.limpiarNumero(this.nueva.peso),
      rendimiento: this.limpiarNumero(this.nueva.rendimiento) || 100,
      peso_unitario: this.limpiarNumero(this.nueva.peso_unitario) || 1
    };

    this.srv.create(datosLimpios).subscribe({
      next: (ing: Ingrediente) => {
        this.ingredientes.push(ing);
        this.filtrarIngredientes();
        this.nueva = {
          nombre_ingrediente: '',
          unidad_medida: 'kg',
          precioKg: 0,
          peso: 0,
          grupo: '',
          rendimiento: 100,
          peso_unitario: 1
        };
      },
      error: (err) => {
        console.error(err);
        alert('Error al agregar ingrediente');
      },
    });
  }

  editar(f: FilaVisual) {
    f.backup = { ...f };
    f.editando = true;
  }

  guardar(f: FilaVisual) {
    const dtoLimpios = {
      nombre_ingrediente: f.nombre_ingrediente,
      unidad_medida: f.unidad_medida,
      grupo: f.grupo,
      precioKg: this.limpiarNumero(f.precioKg),
      peso: this.limpiarNumero(f.peso),
      rendimiento: this.limpiarNumero(f.rendimiento),
      peso_unitario: this.limpiarNumero(f.peso_unitario)
    };

    // Usamos f.id! con el signo de exclamación para asegurar que existe
    if (!f.id) return; 

    this.srv.update(f.id, dtoLimpios).subscribe({
      next: (upd: Ingrediente) => {
        Object.assign(f, upd);
        f.editando = false;
        this.filtrarIngredientes();
        alert('✅ Ingrediente actualizado');
      },
      error: (err) => {
        const mensaje = err.error?.message || 'Error desconocido';
        alert('❌ Error: ' + (Array.isArray(mensaje) ? mensaje.join(', ') : mensaje));
      },
    });
  }

  cancelar(f: FilaVisual) {
    if (f.backup) Object.assign(f, f.backup);
    f.editando = false;
  }

  eliminar(f: FilaVisual) {
    if (!f.id || !confirm(`¿Eliminar "${f.nombre_ingrediente}"?`)) return;

    this.srv.delete(f.id).subscribe({
      next: () => {
        this.ingredientes = this.ingredientes.filter((i) => i.id !== f.id);
        this.filtrarIngredientes();
      },
      error: () => alert('Error al eliminar ingrediente'),
    });
  }

  // 🔴 CORRECCIÓN CLAVE AQUÍ PARA EL ERROR DE "undefined"
  filtrarIngredientes() {
    const texto = (this.busqueda || '').toLowerCase(); // Protegemos this.busqueda
    
    this.ingredientesFiltrados = this.ingredientes.filter((i) => {
      // Protegemos i.nombre_ingrediente y i.grupo con || ''
      const nombre = (i.nombre_ingrediente || '').toLowerCase();
      const grupo = (i.grupo || '').toLowerCase();
      
      return nombre.includes(texto) || grupo.includes(texto);
    });
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