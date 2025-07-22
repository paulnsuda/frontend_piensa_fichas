import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../guards/auth.service';
import { RouterModule } from '@angular/router'; // 👈 AGREGA ESTA LÍNEA

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule], // 👈 AGREGA RouterModule AQUÍ TAMBIÉN
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form: { email: string; password: string } = {
    email: 'paul@example.com',
    password: 'password123'
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    if (!this.form.email || !this.form.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.authService.login(this.form).subscribe({
      next: res => {
        this.authService.setToken(res.access_token);
        this.router.navigate(['/home']);
      },
      error: err => {
        const message = err.error?.message || 'Credenciales incorrectas';
        alert('Error al iniciar sesión: ' + message);
      }
    });
  }
}

