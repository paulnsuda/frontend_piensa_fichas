import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../services/compra.service';
import { ProveedorService } from '../../services/proveedor.service';

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
  compras: any[] = [];
  mensaje: string = '';
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private compraService: CompraService,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      proveedorId: ['', Validators.required],
      peso_kg: [0, [Validators.required, Validators.min(0.001)]],
      costo_total: [0, [Validators.required, Validators.min(0.01)]],
      fecha_compra: ['', Validators.required]
    });

    this.cargarProveedores();
    this.cargarCompras();
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (data) => this.proveedores = data,
      error: () => alert('Error al cargar proveedores')
    });
  }

  cargarCompras() {
    this.compraService.getCompras().subscribe({
      next: (data) => this.compras = data,
      error: () => alert('Error al cargar compras')
    });
  }

  guardar() {
    if (this.form.invalid) return;

    this.cargando = true;
    this.mensaje = '';

    this.compraService.crearCompra(this.form.value).subscribe({
      next: () => {
        this.cargando = false;
        this.mensaje = 'Compra registrada correctamente ✅';
        this.form.reset();
        this.cargarCompras(); // recargar después de guardar
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'Error al registrar la compra ❌';
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
      error: () => {
        this.mensaje = 'Error al eliminar la compra ❌';
      }
    });
  }
}
