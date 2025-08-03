import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../guards/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.form).subscribe({
      next: (res) => {
        // CAMBIO AQUÍ: el token viene como 'access_token'
        this.authService.setToken(res.access_token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        alert('Error al iniciar sesión: ' + err.error.message);
      }
    });
  }
}
