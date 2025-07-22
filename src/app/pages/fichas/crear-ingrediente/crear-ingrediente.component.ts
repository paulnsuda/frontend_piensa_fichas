// src/app/pages/fichas/crear-ingrediente/crear-ingrediente.component.ts
import { Component } from '@angular/core';
import { IngredienteService, Ingrediente } from '../../../services/ingredientes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

interface FilaVisual {
  nombre: string;
  precio: number;
  unidad: string;
  peso: number;
  unidadPeso: 'Gramos' | 'Kilogramos';
  pesoKg: number;
}

@Component({
  selector: 'app-crear-ingrediente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-ingrediente.component.html',
  styleUrls: ['./crear-ingrediente.component.css']
})
export class CrearIngredienteComponent {
  nuevaFila: Partial<FilaVisual> = {
    nombre: '',
    precio: 0,
    unidad: '',
    peso: 0,
    unidadPeso: 'Gramos'
  };

  filas: FilaVisual[] = [];

  constructor(
    private ingredienteService: IngredienteService,
    private location: Location
  ) {}

  goBack() {
    this.location.back();
  }

  agregarFila() {
    if (!this.nuevaFila.nombre || !this.nuevaFila.precio || !this.nuevaFila.unidad || !this.nuevaFila.peso) {
      alert('Por favor completa todos los campos');
      return;
    }

    const pesoKg = this.nuevaFila.unidadPeso === 'Gramos'
      ? (this.nuevaFila.peso! / 1000)
      : this.nuevaFila.peso!;

    const ingredienteParaGuardar: Ingrediente = {
      nombre: this.nuevaFila.nombre!,
      precio: this.nuevaFila.precio!,
      unidad: this.nuevaFila.unidad!
    };

    this.ingredienteService.addIngrediente(ingredienteParaGuardar).subscribe({
      next: () => {
        const filaVisual: FilaVisual = {
          nombre: this.nuevaFila.nombre!,
          precio: this.nuevaFila.precio!,
          unidad: this.nuevaFila.unidad!,
          peso: this.nuevaFila.peso!,
          unidadPeso: this.nuevaFila.unidadPeso!,
          pesoKg
        };

        this.filas.push(filaVisual);

        this.nuevaFila = {
          nombre: '',
          precio: 0,
          unidad: '',
          peso: 0,
          unidadPeso: 'Gramos'
        };
      },
      error: () => alert('Error al guardar ingrediente.')
    });
  }

  eliminarFila(index: number) {
    this.filas.splice(index, 1);
  }
}

