import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngredienteService, Ingrediente } from '../../../services/ingredientes.service';
import { Location } from '@angular/common';

interface FilaFicha {
  ingredienteId: number | null;
  cantidad: number;
  costo: number;
}

@Component({
  selector: 'app-crear-ficha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-ficha.component.html',
  styleUrls: ['./crear-ficha.component.css']
})
export class CrearFichaComponent implements OnInit {
  ingredientesDisponibles: Ingrediente[] = [];
  filas: FilaFicha[] = [
    { ingredienteId: null, cantidad: 0, costo: 0 }
  ];

  constructor(
    private ingredienteService: IngredienteService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.ingredienteService.getIngredientes().subscribe((data: Ingrediente[]) => {
      this.ingredientesDisponibles = data;
    });
  }

  agregarFila() {
    this.filas.push({ ingredienteId: null, cantidad: 0, costo: 0 });
  }

  eliminarFila(index: number) {
    this.filas.splice(index, 1);
  }

  actualizarCosto(index: number) {
    const fila = this.filas[index];
    const ingrediente = this.getIngrediente(fila.ingredienteId);
    if (ingrediente) {
      fila.costo = fila.cantidad * ingrediente.precio;
    }
  }

  getIngrediente(id: number | null): Ingrediente | undefined {
    return this.ingredientesDisponibles.find(i => i.id === id);
  }

  calcularTotal(): number {
    return this.filas.reduce((total, fila) => total + fila.costo, 0);
  }

  goBack() {
    this.location.back();
  }
}
