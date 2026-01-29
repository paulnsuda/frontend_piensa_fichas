import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../guards/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  
  rol: string | null = '';
  menuAbierto = false; // 👈 Agrega esta línea

  ngOnInit() {
    this.rol = this.authService.getUserRole();
  }

  logout() {
    this.authService.logout();
  }
}