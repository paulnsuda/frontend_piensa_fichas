import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-consultar-fichas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './consultar-fichas.component.html',
  styleUrls: ['./consultar-fichas.component.css']
})
export class ConsultarFichasComponent {
  constructor(private router: Router) {}
  goHome() {
    this.router.navigate(['/home']);
  }
}
