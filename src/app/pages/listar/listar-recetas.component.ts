import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecetaService } from '../../services/recetas.service';

@Component({
  standalone: true,
  selector: 'app-listar-recetas',
  imports: [CommonModule],
  templateUrl: './listar-recetas.component.html',
  styleUrls: ['./listar-recetas.component.css'],
})
export class ListarRecetasComponent implements OnInit {
  recetas: any[] = [];

  constructor(private recetaService: RecetaService, private router: Router) {}

  ngOnInit(): void {
    this.recetaService.getRecetas().subscribe({
      next: (data) => (this.recetas = data),
      error: () => alert('Error al cargar recetas'),
    });
  }

  verFicha(id: number) {
    this.router.navigate(['/consultar-receta', id]);
  }
}
