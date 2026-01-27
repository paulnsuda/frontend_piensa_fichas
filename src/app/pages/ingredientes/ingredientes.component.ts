import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngredienteService, Ingrediente } from '../../services/ingredientes.service';

@Component({
  selector: 'app-ingredientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ingredientes.component.html',
  styleUrls: ['./ingredientes.component.css']
})
export class IngredientesComponent implements OnInit {
  
  // 1. VARIABLES QUE PIDE EL HTML
  ingredientes: Ingrediente[] = [];
  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  idEdicion: number | null = null;

  // Objeto vinculado al formulario del Modal
  nuevoIngrediente: Ingrediente = this.inicializarIngrediente();

  // Filtro de búsqueda
  filtros = {
    nombre: ''
  };

  constructor(private srv: IngredienteService) {}

  ngOnInit() {
    this.cargarIngredientes();
  }

  // Helper para reiniciar el objeto limpio
  private inicializarIngrediente(): Ingrediente {
    return {
      nombre_ingrediente: '',
      unidad_medida: 'kg',
      grupo: '',
      precioKg: 0,        // Precio Compra (Bruto)
      
      // Datos del Experimento de Merma
      peso_bruto: 1,      // Defecto 1 (si no se hace test)
      peso_neto: 1,
      peso_desperdicio: 0,
      peso_subproducto: 0,
      
      // Resultados calculados
      rendimiento: 100,
      peso_unitario: 1,
      precio_real: 0,
    };
  }

  cargarIngredientes() {
    this.srv.findAll().subscribe((data) => {
      this.ingredientes = data;
    });
  }

  // --- MÉTODOS DEL MODAL (Los que daban error) ---
  
  abrirModal() {
    this.mostrarModal = true;
    this.modoEdicion = false;
    this.idEdicion = null;
    this.nuevoIngrediente = this.inicializarIngrediente();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nuevoIngrediente = this.inicializarIngrediente();
  }

  // --- LÓGICA MATEMÁTICA DE MERMAS ---

  calcularMetricas() {
    // Aseguramos números
    const bruto = Number(this.nuevoIngrediente.peso_bruto) || 0;
    const neto = Number(this.nuevoIngrediente.peso_neto) || 0;
    const precioCompra = Number(this.nuevoIngrediente.precioKg) || 0;
    const subproducto = Number(this.nuevoIngrediente.peso_subproducto) || 0;

    // 1. Calcular Desperdicio (Basura)
    // Asumimos: Bruto = Neto + Desperdicio + Subproducto
    if (bruto >= neto) {
      this.nuevoIngrediente.peso_desperdicio = bruto - neto - subproducto;
    }

    // 2. Calcular Rendimiento %
    if (bruto > 0) {
      this.nuevoIngrediente.rendimiento = (neto / bruto) * 100;
    } else {
      this.nuevoIngrediente.rendimiento = 0;
    }

    // 3. Calcular Factor de Corrección (Peso Unitario)
    if (neto > 0) {
      this.nuevoIngrediente.peso_unitario = bruto / neto;
    } else {
      this.nuevoIngrediente.peso_unitario = 1;
    }

    // 4. Calcular Precio Real (Costo Técnico)
    this.nuevoIngrediente.precio_real = precioCompra * (this.nuevoIngrediente.peso_unitario || 1);
  }

  // --- CRUD ---

  guardar() {
    // Recalcular por seguridad antes de enviar
    this.calcularMetricas();

    if (this.modoEdicion && this.idEdicion) {
      this.srv.update(this.idEdicion, this.nuevoIngrediente).subscribe({
        next: () => {
          this.cargarIngredientes();
          this.cerrarModal();
        },
        error: (e) => alert('Error al actualizar: ' + e.message)
      });
    } else {
      this.srv.create(this.nuevoIngrediente).subscribe({
        next: () => {
          this.cargarIngredientes();
          this.cerrarModal();
        },
        error: (e) => alert('Error al crear: ' + e.message)
      });
    }
  }

  editar(item: Ingrediente) {
    this.modoEdicion = true;
    this.idEdicion = item.id!;
    // Copia profunda para no editar la tabla visualmente hasta guardar
    this.nuevoIngrediente = { ...item };
    this.mostrarModal = true;
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este ingrediente?')) {
      this.srv.delete(id).subscribe(() => {
        this.cargarIngredientes();
      });
    }
  }

  // Getter para el filtrado en el HTML
  get ingredientesFiltrados() {
    const term = this.filtros.nombre.toLowerCase();
    return this.ingredientes.filter(i => 
      (i.nombre_ingrediente || '').toLowerCase().includes(term) || 
      (i.grupo || '').toLowerCase().includes(term)
    );
  }
}