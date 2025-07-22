import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fichas',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './fichas.component.html',
  styleUrls: ['./fichas.component.css']
})
export class FichasComponent {
  private route = inject(ActivatedRoute);

  // Computed property para saber si hay una ruta hija activa
  hasChildRoute = computed(() => {
    return this.route.firstChild?.snapshot.routeConfig?.path !== undefined;
  });
}
