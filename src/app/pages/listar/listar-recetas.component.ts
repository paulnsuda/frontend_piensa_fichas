import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecetaService } from '../../services/recetas.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-listar-recetas',
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-recetas.component.html',
  styleUrls: ['./listar-recetas.component.css'],
})
export class ListarRecetasComponent implements OnInit {
  recetas: any[] = [];

  constructor(private recetaService: RecetaService, private router: Router) {}

  ngOnInit(): void {
    this.recetaService.findAll().subscribe({
      next: (data: any[]) => (this.recetas = data),
      error: () => alert('Error al cargar recetas'),
    });
  }

  verFicha(id: number) {
    // Redirige al nuevo componente "recetas"
    this.router.navigate(['/recetas', id]);
  }
}
