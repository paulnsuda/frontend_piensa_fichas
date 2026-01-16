import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../services/compra.service';
import { ProveedorService } from '../../services/proveedor.service';
import { IngredienteService } from '../../services/ingredientes.service'; // 👈 OJO: Nombre exacto de tu clase

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  form!: FormGroup;
  proveedores: any[] = [];
  ingredientes: any[] = [];
  compras: any[] = [];
  mensaje: string = '';
  cargando = false;

  private fb = inject(FormBuilder);
  private compraService = inject(CompraService);
  private proveedorService = inject(ProveedorService);
  private ingredienteService = inject(IngredienteService); // 👈 Inyección corregida

  ngOnInit(): void {
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
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (data) => this.proveedores = data,
      error: (e) => console.error('Error cargando proveedores', e)
    });
  }

  // 👇 AQUÍ ESTABA EL ERROR
  cargarIngredientes() {
    this.ingredienteService.findAll().subscribe({ // 👈 Cambiamos listar() por findAll()
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

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensaje = '';
    
    const formValue = this.form.getRawValue();

    // 👇 CONVERSIÓN EXPLÍCITA: Forzamos a que todo sea número real
    const datosBackend = {
      nombre_presentacion: formValue.descripcion,
      
      // Convertimos a Número (si es null o texto, pone 0)
      id_proveedor: Number(formValue.proveedorId),
      id_ingrediente: Number(formValue.id_ingrediente),
      peso_kg: Number(formValue.peso_kg),
      costo_final: Number(formValue.costo_total),
      
      // Valores por defecto
      precio_compra: Number(formValue.costo_total), // Asumimos precio total por ahora
      unidad_compra: 'kg',
      fecha_compra: formValue.fecha_compra // Esto ahora sí lo acepta el DTO
    };

    // Imprimimos en consola qué estamos enviando (Para que tú lo veas)
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
        this.cargarIngredientes(); // Actualizar stock visualmente
      },
      // 👇 MEJORA EN EL REPORTE DE ERRORES
      error: (err) => {
        this.cargando = false;
        console.error('Error detallado:', err);
        
        // Intentamos mostrar el mensaje exacto que manda el backend
        const msg = err.error?.message;
        if (Array.isArray(msg)) {
          this.mensaje = 'Error: ' + msg.join(', '); // Ej: "peso_kg must be a number"
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