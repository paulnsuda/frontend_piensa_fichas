import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-crear-proveedor',
  imports: [CommonModule, RouterModule],
  templateUrl: './crear-proveedor.component.html',
  styleUrl: './crear-proveedor.component.css'
})
export class CrearProveedorComponent {
   constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }
}