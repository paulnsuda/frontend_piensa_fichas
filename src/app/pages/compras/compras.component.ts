import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Servicios
import { CompraService } from '../../services/compra.service';
import { ProveedorService } from '../../services/proveedor.service';
import { IngredienteService } from '../../services/ingredientes.service';
import { RecetaService } from '../../services/recetas.service'; // 👈 NUEVO: Importante para la calculadora

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // 👈 Agregamos FormsModule para la calculadora
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  
  // --- VARIABLES DE LA PESTAÑA "REGISTRO" (LO QUE YA TENÍAS) ---
  form!: FormGroup;
  proveedores: any[] = [];
  ingredientes: any[] = [];
  compras: any[] = [];
  mensaje: string = '';
  cargando = false;

  // --- VARIABLES DE LA PESTAÑA "CALCULADORA" (LO NUEVO) ---
  vistaActual: 'registro' | 'calculadora' = 'registro'; // Controla qué pestaña se ve
  listaRecetas: any[] = [];
  recetaSeleccionadaId: number | null = null;
  cantidadPlatosAProducir: number = 0;
  listaNecesidades: any[] = [];

  // --- INYECCIÓN DE DEPENDENCIAS ---
  private fb = inject(FormBuilder);
  private compraService = inject(CompraService);
  private proveedorService = inject(ProveedorService);
  private ingredienteService = inject(IngredienteService);
  private recetaService = inject(RecetaService); // 👈 Inyectamos el servicio

  ngOnInit(): void {
    // Configuración del Formulario de Compra (Stock)
    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      proveedorId: ['', Validators.required],
      id_ingrediente: [null, Validators.required],
      peso_kg: [0, [Validators.required, Validators.min(0.001)]],
      costo_total: [0, [Validators.required, Validators.min(0.01)]],
      fecha_compra: [new Date().toISOString().split('T')[0], Validators.required]
    });

    this.cargarDatos();
  }

  cargarDatos() {
    this.cargarProveedores();
    this.cargarIngredientes();
    this.cargarCompras();
    this.cargarRecetas(); // 👈 Cargamos las recetas para la calculadora
  }

  // --- MÉTODOS DE CARGA DE DATOS ---

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (data) => this.proveedores = data,
      error: (e) => console.error('Error cargando proveedores', e)
    });
  }

  cargarIngredientes() {
    this.ingredienteService.findAll().subscribe({
      next: (data) => this.ingredientes = data,
      error: (e) => console.error('Error cargando ingredientes', e)
    });
  }

  cargarCompras() {
    this.compraService.getCompras().subscribe({
      next: (data) => this.compras = data,
      error: (e) => console.error('Error cargando compras', e)
    });
  }

  cargarRecetas() {
    this.recetaService.findAll().subscribe({
      next: (data) => this.listaRecetas = data,
      error: (e) => console.error('Error cargando recetas', e)
    });
  }

  // --- LÓGICA DE LA CALCULADORA (OPCIÓN B) ---

  calcularCompras() {
    if (!this.recetaSeleccionadaId || this.cantidadPlatosAProducir <= 0) {
      alert('Por favor selecciona una receta y una cantidad válida.');
      return;
    }

    // Buscamos la receta completa con sus ingredientes
    // Nota: Usamos findOne para asegurar que traemos el detalle de ingredientes si findAll es ligero
    this.recetaService.findOne(this.recetaSeleccionadaId).subscribe({
      next: (recetaFull) => {
        
        const porcionesBase = recetaFull.numPorciones || 1;
        // Factor multiplicador: (Quiero 100 / La receta es para 1) = 100
        const factor = this.cantidadPlatosAProducir / porcionesBase;

        // Hacemos la magia matemática
        this.listaNecesidades = recetaFull.recetasIngredientes.map((ri: any) => {
          // Calculamos cuánto necesitamos para todo el evento
          const cantidadTotalRequerida = ri.cantidad_usada * factor;
          
          return {
            ingrediente: ri.ingrediente.nombre_ingrediente,
            unidad: ri.ingrediente.unidad_medida,
            cantidad_unitaria: ri.cantidad_usada, // Lo que usa 1 plato
            cantidad_total: cantidadTotalRequerida // Lo que usa el evento
          };
        });
      },
      error: (e) => alert('Error al calcular: ' + e.message)
    });
  }

  // --- LÓGICA DE REGISTRO DE COMPRAS (TU CÓDIGO ANTERIOR) ---

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensaje = '';
    
    const formValue = this.form.getRawValue();

    const datosBackend = {
      nombre_presentacion: formValue.descripcion,
      id_proveedor: Number(formValue.proveedorId),
      id_ingrediente: Number(formValue.id_ingrediente),
      peso_kg: Number(formValue.peso_kg),
      costo_final: Number(formValue.costo_total),
      precio_compra: Number(formValue.costo_total), 
      unidad_compra: 'kg',
      fecha_compra: formValue.fecha_compra 
    };

    console.log('Enviando datos:', datosBackend);

    this.compraService.crearCompra(datosBackend).subscribe({
      next: () => {
        this.cargando = false;
        this.mensaje = 'Compra registrada correctamente ✅';
        this.form.reset({
          fecha_compra: new Date().toISOString().split('T')[0],
          peso_kg: 0,
          costo_total: 0,
          id_ingrediente: null,
          proveedorId: ''
        });
        this.cargarCompras();
        this.cargarIngredientes(); 
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error detallado:', err);
        const msg = err.error?.message;
        if (Array.isArray(msg)) {
          this.mensaje = 'Error: ' + msg.join(', ');
        } else {
          this.mensaje = 'Error al registrar: Verifique los campos.';
        }
      }
    });
  }

  eliminarCompra(id: number) {
    if (!confirm('¿Estás seguro de eliminar esta compra?')) return;
    this.compraService.eliminarCompra(id).subscribe({
      next: () => {
        this.mensaje = 'Compra eliminada correctamente ✅';
        this.cargarCompras();
      },
      error: () => this.mensaje = 'Error al eliminar la compra ❌'
    });
  }
}