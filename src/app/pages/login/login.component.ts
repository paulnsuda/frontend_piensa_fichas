import { Component }   from '@angular/core';
import { Router }      from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule }from '@angular/common';
import { RouterLink }  from '@angular/router'; // ← IMPORTANTE

import { AuthService, LoginResponse } from '../../guards/auth.service';

@Component({
  selector   : 'app-login',
  standalone : true,
  imports    : [FormsModule, CommonModule, RouterLink], // ← IMPORTANTE
  templateUrl: './login.component.html',
  styleUrls  : ['./login.component.css']
})
export class LoginComponent {

  form = {
    email   : '',
    password: ''
  };

  constructor(private auth: AuthService,
              private router: Router) {}

  login(): void {
    this.auth.login(this.form).subscribe({
      next : (_: LoginResponse) => this.router.navigate(['/home']),
      error: (err) => alert('Error al iniciar sesión: ' + (err.error?.message ?? '')),
    });
  }
}
