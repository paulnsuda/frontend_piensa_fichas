import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Receta {
  nombre: string;
  tipo: string;
  descripcion: string;
  tiempo: string;
}

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.css']
})
export class RecetasComponent implements OnInit {
  recetas: Receta[] = [];
  recetasFiltradas: Receta[] = [];
  busqueda: string = '';

  nuevaReceta: Receta = {
    nombre: '',
    tipo: '',
    descripcion: '',
    tiempo: ''
  };

  ngOnInit(): void {
    this.recetasFiltradas = [...this.recetas];
  }

  agregarReceta() {
    if (!this.nuevaReceta.nombre || !this.nuevaReceta.tipo || !this.nuevaReceta.tiempo) {
      alert('Completa los campos obligatorios.');
      return;
    }

    this.recetas.push({ ...this.nuevaReceta });
    this.filtrar();
    this.nuevaReceta = { nombre: '', tipo: '', descripcion: '', tiempo: '' };
  }

  filtrar() {
    const texto = this.busqueda.trim().toLowerCase();
    this.recetasFiltradas = this.recetas.filter(r =>
      r.nombre.toLowerCase().includes(texto) || r.tipo.toLowerCase().includes(texto)
    );
  }

  
}
