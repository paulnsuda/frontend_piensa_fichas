import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
// 👇 Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import { AuthService } from '../../guards/auth.service'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // 👈 RouterModule es vital para el link de Login
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  // INYECCIÓN DE DEPENDENCIAS
  private authService = inject(AuthService);
  private router = inject(Router);

  // DATOS DEL FORMULARIO (Coincide con el HTML)
  nuevoUsuario = {
    correo: '',
    password: '',
    rol: '' // Inicializado vacío para el select
  };

  // MÉTODO PARA REGISTRAR
  registrar() {
    // 1. Validaciones básicas visuales
    if (!this.nuevoUsuario.correo || !this.nuevoUsuario.password || !this.nuevoUsuario.rol) {
      alert('⚠️ Por favor, completa todos los campos para continuar.');
      return;
    }

    // 2. PREPARAR DATOS PARA EL BACKEND
    // El HTML usa "correo", pero tu backend (NestJS) probablemente espera "email".
    // Hacemos el mapeo aquí:
    const datosParaBackend = {
      email: this.nuevoUsuario.correo, 
      password: this.nuevoUsuario.password,
      rol: this.nuevoUsuario.rol
    };

    // 3. ENVIAR AL SERVICIO
    this.authService.register(datosParaBackend).subscribe({
      next: () => {
        // Éxito
        alert('✅ ¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Manejo de errores
        console.error('Error registro:', err);
        const mensaje = err.error?.message || 'Ocurrió un error inesperado.';
        alert('❌ Error al registrar: ' + mensaje);
      }
    });
  }
}

