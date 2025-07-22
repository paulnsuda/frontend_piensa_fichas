import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-consultar-receta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './consultar-receta.component.html',
  styleUrls: ['./consultar-receta.component.css']
})
export class ConsultarRecetaComponent {
  constructor(private router: Router) {}
  goHome() {
    this.router.navigate(['/home']);
  }
}
