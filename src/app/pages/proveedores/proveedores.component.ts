import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // 👈 IMPORTANTE
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  form!: FormGroup;
  proveedores: any[] = [];
  mensaje: string = '';
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      contacto: ['']
    });

    this.proveedorService.getProveedores().subscribe({
      next: (data) => (this.proveedores = data),
      error: () => alert('Error al cargar proveedores')
    });
  }

  guardar() {
    if (this.form.invalid) return;

    this.cargando = true;
    this.mensaje = '';

    this.proveedorService.crearProveedor(this.form.value).subscribe({
      next: () => {
        this.cargando = false;
        this.mensaje = 'Proveedor registrado correctamente ✅';
        this.form.reset();

        // Volver a cargar la lista
        this.proveedorService.getProveedores().subscribe({
          next: (data) => (this.proveedores = data)
        });
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'Error al registrar el proveedor ❌';
      }
    });
  }
}
