import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngredienteService, Ingrediente } from '../../../services/ingredientes.service';



      

@Component({
  selector: 'app-consultar-ingrediente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultar-ingrediente.component.html',
  styleUrls: ['./consultar-ingrediente.component.css']
})
export class ConsultarIngredienteComponent implements OnInit {
  ingredientes: Ingrediente[] = [];
  ingredientesFiltrados: Ingrediente[] = [];
  busqueda: string = '';

  constructor(private ingredienteService: IngredienteService) {}

  ngOnInit() {
    this.ingredienteService.getIngredientes().subscribe({
      next: (data) => {
        this.ingredientes = data;
        this.ingredientesFiltrados = data;
      },
      error: () => alert('Error al cargar ingredientes.')
    });
  }

  filtrar() {
    const texto = this.busqueda.trim().toLowerCase();
    this.ingredientesFiltrados = this.ingredientes.filter(i =>
      i.nombre.toLowerCase().includes(texto)
    );
  }
}
