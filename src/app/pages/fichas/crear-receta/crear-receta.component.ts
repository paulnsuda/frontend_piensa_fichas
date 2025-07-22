import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-crear-receta',
  imports:[CommonModule, RouterModule],
  templateUrl: './crear-receta.component.html',
  styleUrl: './crear-receta.component.css'
})
export class CrearRecetaComponent {
 constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }
}