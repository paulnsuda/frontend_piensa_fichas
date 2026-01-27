import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  form!: FormGroup;
  proveedores: any[] = [];
  mensaje: string = '';
  cargando = false;

  // 👇 LISTA DE RUBROS PARA EL DESPLEGABLE
  rubros: string[] = [
    'Carnes', 
    'Verduras y Frutas', 
    'Abarrotes', 
    'Lácteos', 
    'Licores', 
    'Descartables',
    'Otros'
  ];

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    // 👇 INICIALIZAMOS EL FORMULARIO CON LOS NUEVOS CAMPOS
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      contacto: [''],
      
      // Nuevos campos acordados:
      rubro: ['Abarrotes', Validators.required], // Valor por defecto
      frecuencia: [''], // Ej: "Lunes y Jueves"
      calificacion: [5, [Validators.min(1), Validators.max(5)]] // Puntuación inicial
    });

    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (data) => (this.proveedores = data),
      error: () => alert('Error al cargar proveedores')
    });
  }

  guardar() {
    if (this.form.invalid) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    // El objeto this.form.value ya contiene { nombre, contacto, rubro, frecuencia, calificacion }
    this.proveedorService.crearProveedor(this.form.value).subscribe({
      next: () => {
        this.cargando = false;
        this.mensaje = 'Proveedor registrado correctamente ✅';
        
        // Reseteamos el formulario manteniendo valores por defecto lógicos
        this.form.reset({
          rubro: 'Abarrotes',
          calificacion: 5
        });

        // Recargar la lista para ver el cambio
        this.cargarProveedores();
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'Error al registrar el proveedor ❌';
      }
    });
  }
  
  // Función opcional para eliminar (si la necesitas conectar en el HTML)
  eliminar(id: number) {
    if(confirm('¿Estás seguro de eliminar este proveedor?')) {
        this.proveedorService.eliminarProveedor(id).subscribe(() => {
            this.cargarProveedores();
        });
    }
  }
}