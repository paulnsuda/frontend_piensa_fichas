import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Ficha {
  nombre: string;
  grupo: string;
  descripcion: string;
  costoTotal: number;
}

@Component({
  selector: 'app-fichas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fichas.component.html',
  styleUrls: ['./fichas.component.css']
})
export class FichasComponent implements OnInit {
  fichas: Ficha[] = [];
  fichasFiltradas: Ficha[] = [];
  busqueda: string = '';

  nuevaFicha: Ficha = {
    nombre: '',
    grupo: '',
    descripcion: '',
    costoTotal: 0
  };

  ngOnInit(): void {
    // En un futuro esto puede venir del backend
    this.fichasFiltradas = [...this.fichas];
  }

  agregarFicha() {
    if (!this.nuevaFicha.nombre || !this.nuevaFicha.grupo || !this.nuevaFicha.costoTotal) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    this.fichas.push({ ...this.nuevaFicha });
    this.filtrar();
    this.nuevaFicha = { nombre: '', grupo: '', descripcion: '', costoTotal: 0 };
  }

  filtrar() {
    const texto = this.busqueda.trim().toLowerCase();
    this.fichasFiltradas = this.fichas.filter(f =>
      f.nombre.toLowerCase().includes(texto) || f.grupo.toLowerCase().includes(texto)
    );
  }
}